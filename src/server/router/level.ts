import { createRouter } from "./context";
import { z } from "zod";
import type { Prisma } from ".prisma/client";

export const levelRouter = createRouter()
    .mutation("create", {
        input: z.object({
            name: z.string().min(1).max(64),
            data: z.array(z.array(z.string().nullable())),
            unlisted: z.boolean(),
        }),
        resolve: async ({ ctx, input }) => {
            const { name, data } = input;
            const size = data.length;
            if (size === 0 || (data[0] as string[]).length !== size) return;
            const level = await ctx.prisma.level.create({
                data: {
                    name,
                    size,
                    data: data as Prisma.JsonArray,
                    unlisted: input.unlisted,
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
            const levelCount = await ctx.prisma.level.count({
                where: {
                    unlisted: false,
                },
            });
            const skip = Math.floor(Math.random() * levelCount);
            return (await ctx.prisma.level.findMany(
                {
                    where: {
                        unlisted: false,
                    },
                    take: 1,
                    skip,
                }
            ))[0] || null;
        }
    })
    .query("fetchInfinite", {
        input: z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.number().nullish(),
            search: z.string().nullish(),
            minSize: z.number().min(4).max(15),
            maxSize: z.number().min(4).max(15),
        }),
        async resolve({ ctx, input }) {
            const limit = input.limit ?? 50;
            const { cursor } = input;

            const items = await ctx.prisma.level.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: {
                    unlisted: false,
                    ...(input.search ? { name: { contains: input.search } } : {}),
                    ...({ size: { gte: input.minSize, lte: input.maxSize } }),
                },
                select: {
                    id: true,
                    index: true,
                    name: true,
                    createdAt: true,
                    size: true,
                },
                cursor: cursor ? { index: cursor } : undefined,
                orderBy: {
                    index: 'asc',
                },
            })

            let nextCursor: typeof cursor | null = null;
            if (items.length > limit) {
                const nextItem = items.pop()
                nextCursor = nextItem!.index;
            }

            return {
                items: items.map(item => ({ id: item.id, name: item.name, createdAt: item.createdAt, size: item.size })),
                nextCursor,
            };
        }
    });
