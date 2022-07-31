import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
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
            <meta name="description" content={`A ${data?.size} by ${data?.size} nonogram puzzle.`} />
        </Head>
        <div className="flex h-full w-full flex-col items-center justify-evenly">
            <header className="text-4xl my-8 text-center">&ldquo;{data?.name}&rdquo;</header>
            <div className="my-2">
                {!levelLoading && <Board levelData={levelData} size={isMobile ? 0 : 2} />}
            </div>
            {/* <button className="mx-2 text-2xl" onClick={() => setIsStarred(!isStarred)}>{isStarred ? 'Remove Star' : 'Star'}</button> */}
            <h2 className="text-3xl my-8">Size: {`${data?.size}x${data?.size}`}</h2>
        </div >
    </>
}

export default Puzzle