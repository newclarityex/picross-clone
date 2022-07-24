import { createRouter } from "./context";
import { z } from "zod";
import type { Prisma } from ".prisma/client";

export const levelRouter = createRouter()
    .mutation("create", {
        input: z.object({
            name: z.string(),
            data: z.array(z.array(z.string().nullable())),
        }),
        resolve: async ({ ctx, input }) => {
            const { name, data } = input;
            const level = await ctx.prisma.level.create({
                // @ts-ignore
                data: {
                    name,
                    data: data as Prisma.JsonArray,
                },
            });
            return level;
        }
    })
    .query("fetchById", {
        input: z.string(),
        async resolve({ ctx, input }) {
            return await ctx.prisma.level.findFirst(
                {
                    where: {
                        id: input,
                    },
                }
            );
        },
    })
    .query("fetchRandom", {
        async resolve({ ctx }) {
            const levelCount = await ctx.prisma.level.count();
            const skip = Math.floor(Math.random() * levelCount);
            return (await ctx.prisma.level.findMany(
                {
                    take: 1,
                    skip,
                }
            ))[0] || null;
        }
    })
    .query("fetchAll", {
        async resolve({ ctx }) {
            return await ctx.prisma.level.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    stars: true,
                }
            });
        }
    });
