import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link';
import Board from "../components/Board";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const { data, refetch } = trpc.useQuery(["level.fetchById", "cl5vfukjw000970vzg2q3pq4h"], { staleTime: Infinity });
    const levelData = data || null;

    return (
        <>
            <Head>
                <title>Picross Clone</title>
                <meta name="description" content="A simple Picross clone." />
            </Head>

            <div className="flex flex-col items-center lg:justify-center h-full">
                <header className="font-semibold text-5xl text-center">Picross</header>
                <div className="my-24">
                    <Board levelData={levelData} />
                    {levelData === null && <div className="text-center text-4xl font-semibold">Loading...</div>}
                </div>
                <div className="flex flex-col lg:flex-row items-center">
                    <button className="w-56 text-center font-semibold border-2 border-black py-2 text-xl bg-gray-300">Browse Puzzles</button>
                    <button className="w-56 text-center font-semibold border-2 border-black py-2 text-xl bg-gray-300 lg:mx-12 my-12 lg:my-0">Random Puzzle</button>
                    <Link href="./editor">
                        <a className="w-56 text-center block font-semibold border-2 border-black py-2 text-xl bg-gray-300">Create Puzzle</a>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Home;
