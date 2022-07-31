import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link';
import Board from "../components/Board";
import { trpc } from "../utils/trpc";
import useMediaQuery from "../hooks/useMediaQuery";

const Home: NextPage = () => {
    const { data: levelData, refetch: refetchLevelData } = trpc.useQuery(["level.fetchById", "cl673mstt0010q4vzw0zpzj8n"], { staleTime: Infinity });

    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <>
            <Head>
                <title>Picross Clone</title>
                <meta name="description" content="A simple Picross clone." />
            </Head>

            <div className="h-full min-h-fit flex flex-col items-center justify-evenly py-4">
                <h2 className="text-3xl lg:text-4xl mt-12 mb-8 text-center">A simple nonogram/picross game</h2>
                <div className="my-4">
                    <Board levelData={levelData || null} size={isMobile ? 0 : 2} />
                </div>
                <div className="text-2xl text-center my-4">
                    Developed by <Link href="https://kiralu.dev"><a className="text-blue-400">Kira Lu</a></Link>
                    <br /><br />
                    Built with the <Link href="https://github.com/t3-oss/create-t3-app"><a className="text-blue-400">T3</a></Link> stack
                    <br />
                    (Typescript, tRPC, tailwindcss, Next.js, Prisma, MySQL)
                    <br /><br />
                    Deployed on <Link href="https://vercel.com/"><a className="text-blue-400">Vercel</a></Link> serverlessly.
                </div>
            </div>
        </>
    );
};

export default Home;
