import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'
import Board from '../../components/Board'

const Puzzle: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const { data, refetch } = trpc.useQuery(["level.fetchById", id as string], { staleTime: Infinity });
    const grid = (data?.data || []) as (string | null)[][]
    const levelData = data || null;

    return <>
        <Head>
            <title>{data?.name}</title>
            <meta name="description" content="A simple Picross clone." />
        </Head>
        <div className="grid h-full w-full" style={{ gridTemplateColumns: "min-content 1fr" }}>
            <div className="flex items-center py-20 px-20">
                <Board levelData={levelData} size={1000} />
                {levelData === null && <div className="text-center text-4xl font-semibold">Loading...</div>}
            </div>
            <div className="flex flex-col justify-evenly items-center">
                <header className="font-semibold text-4xl">"{data?.name}"</header>
                <h2 className="font-semibold text-3xl">Size: {`${grid.length || 0}x${grid[0]?.length || 0}`}</h2>
                <div className="flex flex-col lg:flex-row items-center">
                    <button className="w-56 text-center font-semibold border-2 border-black py-2 text-xl bg-gray-300">Browse Puzzles</button>
                    <button className="w-56 text-center font-semibold border-2 border-black py-2 text-xl bg-gray-300 lg:mx-12 my-12 lg:my-0">Random Puzzle</button>
                    <Link href="./editor">
                        <a className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300">Create Puzzle</a>
                    </Link>
                </div>
            </div>
        </div>
    </>
}

export default Puzzle