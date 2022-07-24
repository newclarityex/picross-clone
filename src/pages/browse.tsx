import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '../utils/trpc'
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getPaginationRowModel
} from '@tanstack/react-table'

type Level = {
    data: {
        id: string
        name: string
        stars: number
        createdAt: Date
    }
}

const columnHelper = createColumnHelper<Level>()

const columns = [
    columnHelper.accessor('data', {
        header: () => 'Name',
        cell: info => <Link href={`./puzzle/${info.getValue().id}`}><a className="text-blue-500">{info.getValue().name}</a></Link>
    }),
    columnHelper.accessor('data', {
        header: () => 'Date',
        cell: info => info.getValue().createdAt.toLocaleString(),
    }),
    columnHelper.accessor('data', {
        header: () => 'Stars',
        cell: info => info.renderValue()?.stars || 0,
    }),
]

const Puzzle: NextPage = () => {
    const { data, refetch, isLoading } = trpc.useQuery(["level.fetchAll"], { staleTime: Infinity });
    const arr = data?.map(entry => {
        return {
            data: entry,
        }
    })
    const table = useReactTable({
        data: arr?.concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]).concat([...arr]) || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return <>
        <Head>
            <title>Browse Puzzles</title>
            <meta name="description" content="A simple Picross clone." />
        </Head>
        <div className="h-full w-full flex flex-col items-center justify-center">
            <h1 className="text-4xl font-semibold mb-36">Puzzle Browser</h1>
            {isLoading && <div className="text-center text-4xl font-semibold">Loading...</div>}
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={
                () => table.previousPage()}>Previous Page</button>
            <button onClick={
                () => table.nextPage()
            }>Next Page</button>
            <div>Page {table.getState().pagination.pageIndex + 1}</div>

        </div>
    </>
}

export default Puzzle;