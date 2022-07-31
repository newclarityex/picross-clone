import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../utils/trpc'
import { useEffect, useState } from 'react'
import DoubleRangeSlider from '../components/DoubleRangeSlider'

const Puzzle: NextPage = () => {
    const [search, setSearch] = useState('');
    const [minSize, setMinSize] = useState(4);
    const [maxSize, setMaxSize] = useState(15);

    const {
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        data,
        refetch
    } = trpc.useInfiniteQuery(["level.fetchInfinite", {
        limit: 100,
        search: search === '' ? null : search,
        minSize: minSize,
        maxSize: maxSize,
    }],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        });

    const results: {
        id: string,
        name: string,
        createdAt: Date,
        size: number,
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
        <div className="w-full flex flex-col items-center overflow-y-auto" onScroll={handleScroll}>
            <h1 className="text-4xl mt-16 mb-8">Puzzle Browser</h1>
            <div className="flex flex-col lg:flex-row items-center my-8">
                <div className="lg:mr-12 flex flex-col lg:flex-row mb-8 lg:mb-0">
                    <label htmlFor="search" className="text-2xl lg:mr-2 text-center">Search:</label>
                    <input type="text" className="border-2 border-black py-1 px-2 text-xl" value={search} onChange={(event) => setSearch(event.target.value)} id="search" />
                </div>
                <div>
                    <label htmlFor="size-slider" className="text-center block">Size Range</label>
                    <div id="size-slider" className="w-40 h-2 my-1">
                        <DoubleRangeSlider min={4} max={15} onChange={(lowVal, highVal) => {
                            setMinSize(lowVal);
                            setMaxSize(highVal);
                        }} />
                    </div>
                    <div className="text-center">{minSize} - {maxSize}</div>
                </div>
            </div>
            <table>
                <thead>
                    <tr className="text-xl lg:text-2xl">
                        <th className="w-40 lg:w-96 h-14">Name</th>
                        <th className="w-24 lg:w-40 h-14">Date</th>
                        <th className="w-20 h-14">Size</th>
                    </tr>
                </thead>
                <tbody className="text-center lg:text-xl">
                    {results.map((level) => {
                        return <tr key={level.id} className="h-10">
                            <td>
                                <Link href={`/puzzle/${level.id}`}>
                                    <a className="block text-blue-400 overflow-ellipsis overflow-hidden whitespace-nowrap px-2 lg:px-8 w-40 lg:w-96">{level.name}</a>
                                </Link>
                            </td>
                            <td>{level.createdAt.toLocaleDateString()}</td>
                            <td>{level.size}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </>
}

export default Puzzle;