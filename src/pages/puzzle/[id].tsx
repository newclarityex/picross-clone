import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'
import Board from '../../components/Board'
import useMediaQuery from '../../hooks/useMediaQuery'

const Puzzle: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data, refetch, isLoading: levelLoading } = trpc.useQuery(["level.fetchById", id as string], { staleTime: Infinity });
    const grid = (data?.data || []) as (string | null)[][]
    const levelData = data || null;
    const isMobile = useMediaQuery("(max-width: 768px)");

    return <>
        <Head>
            <title>{data?.name}</title>
            <meta name="description" content="A simple Picross clone." />
        </Head>
        <div className="grid w-full grid-cols-2">
            <div className="flex items-center justify-center">
                {!levelLoading && <Board levelData={levelData} size={isMobile ? 0 : 2} />}
                {levelLoading && <div className="text-center text-4xl font-semibold">Loading...</div>}
            </div>
            <div className="flex flex-col justify-evenly items-center">
                <header className="font-semibold text-4xl">&ldquo;{data?.name}&rdquo;</header>
                {/* <button className="mx-2 text-2xl" onClick={() => setIsStarred(!isStarred)}>{isStarred ? 'Remove Star' : 'Star'}</button> */}
                <h2 className="font-semibold text-3xl">Size: {`${grid.length || 0}x${grid[0]?.length || 0}`}</h2>
            </div>
        </div >
    </>
}

export default Puzzle