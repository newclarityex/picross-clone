// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { levelRouter } from "./level";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("level.", levelRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
