import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'
import Board from '../../components/Board'
import { useEffect } from 'react'

const Puzzle: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const { data, refetch, isLoading: levelLoading } = trpc.useQuery(["level.fetchById", id as string], { staleTime: Infinity });
    const grid = (data?.data || []) as (string | null)[][]
    const levelData = data || null;
    const { data: randomLevel, refetch: refetchRandomLevel, isLoading: randomLevelLoading } = trpc.useQuery(["level.fetchRandom"]); 0

    return <>
        <Head>
            <title>{data?.name}</title>
            <meta name="description" content="A simple Picross clone." />
        </Head>
        <div className="grid h-full w-full grid-cols-2">
            <div className="flex items-center py-20 px-20">
                {!levelLoading && <Board levelData={levelData} size={1000} />}
                {levelLoading && <div className="text-center text-4xl font-semibold">Loading...</div>}
            </div>
            <div className="flex flex-col justify-evenly items-center">
                <header className="font-semibold text-4xl">&quot;{data?.name}&quot;</header>
                <h2 className="font-semibold text-3xl">Size: {`${grid.length || 0}x${grid[0]?.length || 0}`}</h2>
                <div className="flex flex-col items-center">
                    <Link href="../">
                        <a className="block w-24 text-center text-xl font-semibold border-2 border-black py-2 bg-gray-300 my-4">Home</a>
                    </Link>
                    <Link href="../browse">
                        <a className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300 my-4">Browse Puzzles</a>
                    </Link>
                    <button disabled={randomLevel === undefined || randomLevel === null || randomLevelLoading} onClick={
                        async () => {
                            await refetchRandomLevel();
                            router.push(`../puzzle/${randomLevel!.id}`);
                        }
                    } className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300 my-4 disabled:opacity-20">Random Puzzle</button>
                    <Link href="../editor">
                        <a className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300 my-4">Create Puzzle</a>
                    </Link>
                </div>
            </div>
        </div >
    </>
}

export default Puzzle