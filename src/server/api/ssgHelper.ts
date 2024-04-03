import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { createTRPCContext } from "./trpc";
import { appRouter } from "./root";

export async function ssgHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext({headers: new Headers()}),
    transformer: SuperJSON,
  })
}