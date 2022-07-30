import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link';
import Board from "../components/Board";
import { trpc } from "../utils/trpc";
import { useRouter } from 'next/router'

const Home: NextPage = () => {
    const { data: levelData, refetch: refetchLevelData } = trpc.useQuery(["level.fetchById", "cl673mstt0010q4vzw0zpzj8n"], { staleTime: Infinity });
    const { data: randomLevel, isLoading: randomLevelLoading } = trpc.useQuery(["level.fetchRandom"]);
    // window.matchMedia("(min-width: 768px)").matches

    const router = useRouter();

    return (
        <>
            <Head>
                <title>Picross Clone</title>
                <meta name="description" content="A simple Picross clone." />
            </Head>

            <div className="flex flex-col items-center lg:justify-center h-full">
                <header className="font-semibold text-5xl text-center">Picross</header>
                <div className="my-24">
                    <Board levelData={levelData || null} size={400} />
                    {levelData === null && <div className="text-center text-4xl font-semibold">Loading...</div>}
                </div>
                <div className="flex flex-col lg:flex-row items-center">
                    <Link href="./browse">
                        <a className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300">Browse Puzzles</a>
                    </Link>
                    <Link href={`./puzzle/${randomLevel?.id}`}>
                        <a className={`w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300 mx-8 ${randomLevelLoading ? 'opacity-20' : ''}`}>Random Puzzle</a>
                    </Link>
                    <Link href="./editor">
                        <a className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300">Create Puzzle</a>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Home;
