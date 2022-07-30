import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../utils/trpc'
import { useEffect, useState } from 'react'
import { Level } from '.prisma/client'

const Puzzle: NextPage = () => {
    const [search, setSearch] = useState('');
    const {
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        data,
        refetch
    } = trpc.useInfiniteQuery(["level.fetchInfinite", {
        limit: 100,
        search: search === '' ? null : search
    }],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        });

    const results: {
        id: string,
        name: string,
        createdAt: Date,
        stars: number,
    }[] = [];
    if (data !== undefined) {
        data.pages.forEach(page => {
            page.items.forEach(level => {
                results.push(level);
            });
        });
    }

    function handleScroll(event: React.UIEvent<HTMLDivElement>) {
        const element = event.currentTarget;
        if (isLoading || isFetchingNextPage) return;
        if (!hasNextPage) return;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
            fetchNextPage();
        }
    }

    return <>
        <Head>
            <title>Browse Puzzles</title>
            <meta name="description" content="A simple Picross clone." />
        </Head>
        <div className="h-full w-full flex flex-col items-center overflow-y-auto" onScroll={handleScroll}>
            <h1 className="text-4xl font-semibold my-16">Puzzle Browser</h1>
            <input type="text" className="bg-blue-300 py-2 px-4" value={search} onChange={(event) => setSearch(event.target.value)} />
            <table>
                <thead>
                    <tr>
                        <th className="w-96">Name</th>
                        <th className="w-40">Date</th>
                        <th className="w-20">Stars</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {results.map((level) => {
                        return <tr key={level.id}>
                            <td className="overflow-ellipsis">
                                <Link href={`/puzzle/${level.id}`}>
                                    <a className="text-blue-400">{level.name}</a>
                                </Link>
                            </td>
                            <td>{level.createdAt.toLocaleDateString()}</td>
                            <td>{level.stars}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <Link href="./">
                <a className="my-8 block w-24 text-center text-xl font-semibold border-2 border-black py-2 bg-gray-300">Home</a>
            </Link>
        </div>
    </>
}

export default Puzzle;