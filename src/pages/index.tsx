import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Board from "../components/Board"
import BoardEditor from "../components/BoardEditor";
import { useState } from "react";

const Home: NextPage = () => {
    const { data, refetch } = trpc.useQuery(["level.fetchRandom"], { staleTime: Infinity });
    const levelData = data || null;

    const [editorOpen, setEditorOpen] = useState(false);
    return (
        <>
            <Head>
                <title>Picross</title>
                <meta name="description" content="A simple Picross clone." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col items-center justify-evenly h-full">
                <header className="py-8 px-8 font-semibold text-5xl">Picross Clone</header>
                {!editorOpen && <Board levelData={levelData} />}
                {editorOpen && <BoardEditor />}
                {!editorOpen && <div className="flex flex-row">
                    <button className="font-semibold border-2 border-black px-3 py-2 text-xl bg-gray-300" onClick={() => setEditorOpen(true)}>Browse Puzzles</button>
                    <button className="font-semibold border-2 border-black px-3 py-2 text-xl bg-gray-300 mx-4" onClick={() => refetch()}>Random Puzzle</button>
                    <button className="font-semibold border-2 border-black px-3 py-2 text-xl bg-gray-300" onClick={() => setEditorOpen(true)}>Create Puzzle</button>
                </div>}
                {editorOpen && <button className="font-semibold border-2 border-black px-3 py-2 text-xl bg-gray-300" onClick={() => setEditorOpen(false)}>Close Editor</button>}
            </div>
        </>
    );
};

export default Home;
