import { Elysia, t } from "elysia";
import { db } from "./db";
import {
  cart,
  cart_product,
  order_detail,
  order_product,
  products,
} from "./schema";
import { eq, sql } from "drizzle-orm";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { edenTreaty } from "@elysiajs/eden";

function randomDate() {
  const start = new Date();
  const end = new Date(start.getFullYear(), 11, 31);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

const app = new Elysia()
  .use(swagger())
  .use(
    cors({
      methods: ["GET", "PUT", "DELETE", "POST"],
    }),
  )
  .get("/products", async () => {
    return await db.query.products.findMany({
      with: {
        cart_product: true,
      },
    });
  })
  .get("/cart", async () => {
    return await db.query.cart_product.findMany({
      with: {
        product: true,
      },
    });
  })
  .delete(
    "/cart",
    async ({ body }) => {
      let currentCart: any = await db.select().from(cart);
      currentCart = currentCart[0]?.id;
      if (!currentCart) {
        currentCart = (
          await db.insert(cart).values({}).returning({ cart_id: cart.id })
        )[0].cart_id;
      }
      const deletedProduct = await db
        .delete(cart_product)
        .where(eq(cart_product.product_id, body.id))
        .returning();
      return deletedProduct;
    },
    {
      body: t.Object({
        id: t.Numeric(),
      }),
    },
  )
  .post(
    "/cart",
    async ({ body }) => {
      try {
        let currentCart: any = await db.select().from(cart);
        currentCart = currentCart[0]?.id;
        if (!currentCart) {
          currentCart = (
            await db.insert(cart).values({}).returning({ cart_id: cart.id })
          )[0].cart_id;
        }

        if (body.quantity === 0) {
          const deletedProduct = await db
            .delete(cart_product)
            .where(eq(cart_product.product_id, body.id))
            .returning();
          return deletedProduct;
        }

        const updatedProduct = await db
          .insert(cart_product)
          .values({
            cart_id: currentCart,
            quantity: body.quantity,
            product_id: body.id,
          })
          .onConflictDoUpdate({
            target: [cart_product.product_id, cart_product.cart_id],
            set: { quantity: body.quantity },
          })
          .returning();
        return updatedProduct;
      } catch (e) {
        console.log(e);
      }
    },
    {
      body: t.Object({
        id: t.Numeric(),
        quantity: t.Numeric(),
      }),
    },
  )
  .post(
    "/checkout",
    async ({ body }) => {
      const order = await db
        .insert(order_detail)
        .values({ total: body.total, payment_method: body.payment_method })
        .returning();
      const submittedProducts = body.products.map(({ id, quantity }) => ({
        quantity,
        product_id: id,
        order_id: order[0].id,
      }));
      const products = await db
        .insert(order_product)
        .values(submittedProducts)
        .returning();

      await db.delete(cart);
      await db.delete(cart_product);

      return {
        ...order[0],
        products,
        total: body.total,
      };
    },
    {
      body: t.Object({
        total: t.Numeric(),
        payment_method: t.Enum({ credit: "credit", cash: "cash" }),
        products: t.Array(
          t.Object({
            id: t.Numeric(),
            quantity: t.Numeric(),
          }),
        ),
      }),
    },
  )
  .listen(3000);

export type App = typeof app;
const serverApp = edenTreaty<App>("http://localhost:8080");
export type Server = typeof serverApp;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
