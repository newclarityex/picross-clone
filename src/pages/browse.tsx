import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../utils/trpc'
import { useEffect } from 'react'

const Puzzle: NextPage = () => {
    const page = useRouter();
    const { data, refetch, isLoading } = trpc.useQuery(["level.fetchInfinite", {}], { staleTime: Infinity });
    useEffect(() => {
        if (!data) return;
        console.log(data);
    }), [data];

    return <>
        <Head>
            <title>Browse Puzzles</title>
            <meta name="description" content="A simple Picross clone." />
        </Head>
        <div className="h-full w-full flex flex-col items-center justify-center">
            <h1 className="text-4xl font-semibold mb-36">Puzzle Browser</h1>
            {isLoading && <div className="text-center text-4xl font-semibold">Loading...</div>}
            <table>
                <tbody>
                </tbody>
            </table>
        </div>
    </>
}

export default Puzzle;