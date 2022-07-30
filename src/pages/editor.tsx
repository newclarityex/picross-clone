import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";
import { BlockPicker } from 'react-color';

const Editor: NextPage = () => {
    const { mutate, data, isLoading } = trpc.useMutation(["level.create"]);
    const [selectedColor, setSelectedColor] = useState('#dddddd');
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);
    const [cellSize, setCellSize] = useState(500 / Math.max(width, height));

    const createEmptyGrid = (width: number, height: number): (string | null)[][] => {
        return new Array(height).fill(new Array(width).fill(null))
    }

    const [grid, setGrid] = useState(createEmptyGrid(width, height));
    useEffect(() => {
        const newGrid = [];
        for (let i = 0; i < height; i++) {
            const newRow = [];
            for (let j = 0; j < width; j++) {
                const row = grid[i];
                if (row === undefined) newRow.push(null);
                else if (row[j] === undefined) newRow.push(null);
                else newRow.push(row[j]);
            }
            newGrid.push(newRow);
        }
        setGrid(newGrid as (string | null)[][]);
        setCellSize(500 / Math.max(width, height))
    }, [width, height]);

    const changeCell = (y: number, x: number, value: string | null) => {
        if (grid[y] === undefined) return;
        if (grid[y]![x] === undefined) return;

        const newGrid = [...grid];
        newGrid[y]![x] = value;
        setGrid(newGrid);
    }

    const [isFilling, setIsFilling] = useState(false);
    const [pointerFill, setPointerFill] = useState(null as string | null);
    const handlePointerOver = (event: React.PointerEvent<HTMLTableCellElement>, row: number, column: number) => {
        if (!isFilling) return;
        if (event.buttons === 1) {
            changeCell(row, column, pointerFill);
        }
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLTableCellElement>, rowIndex: number, columnIndex: number) => {
        if (event.buttons === 1) {
            const row = grid[rowIndex];
            if (row === undefined) return;
            const cell = row[columnIndex];
            if (cell === undefined) return;
            setIsFilling(true);
            const filling = cell === null ? selectedColor : null;
            setPointerFill(filling);
            changeCell(rowIndex, columnIndex, filling);
        }
    }

    useEffect(() => {
        window.addEventListener("pointerup", () => {
            setPointerFill(null);
        }, { once: true });
    }, []);

    const [pickerOpen, setPickerOpen] = useState(false);
    const handleChangeComplete = (color: any) => {
        setSelectedColor(color.hex);
    }

    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        unlisted: false,
    });

    const [isSaving, setIsSaving] = useState(false);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.name === "") return;
        mutate({
            name: formData.name,
            data: grid,
            unlisted: formData.unlisted,
        });
        setNameModalOpen(false);
        setGrid(createEmptyGrid(width, height));
        setIsSaving(true);
        setFormData({
            name: "",
            unlisted: false,
        });
    };

    const [copied, setCopied] = useState(false);
    function updateClipboard(text: string) {
        navigator.clipboard.writeText(text);
        setCopied(true);
    }

    return (
        <>
            <Head>
                <title>Picross Editor</title>
                <meta name="description" content="Create custom nonogram puzzles to play and share!" />
            </Head>
            {data && isSaving && !isLoading && <div className="absolute h-full w-full grid place-items-center z-50 bg-black/80">
                <div className="absolute z-10 p-4 flex flex-col items-center bg-gray-200 border-2 border-black">
                    <h1 className="text-4xl font-semibold my-2">Level Created!</h1>
                    <h2 className="text-2xl my-2">{data.name}</h2>
                    <Link href={`/puzzle/${data.id}`}>
                        <a className="text-blue-400">
                            {location.protocol + '//' + location.host}/puzzle/{data.id}
                        </a>
                    </Link>
                    <button onClick={() => updateClipboard(`${location.protocol + '//' + location.host}/puzzle/${data.id}`)}>{copied ? 'Copied' : 'Copy Link'}</button>
                    <button onClick={() => { setIsSaving(false), setCopied(false) }}>Finish</button>
                </div>
            </div>}
            {nameModalOpen && <div className="absolute h-full w-full grid place-items-center z-40 bg-black/80">
                <form className="absolute z-10 p-4 flex flex-col items-center bg-gray-200 border-2 border-black" onSubmit={handleSubmit}>
                    <button className="absolute top-0 right-2 text-2xl" onClick={() => setNameModalOpen(false)}>x</button>
                    <h2 className="font-semibold text-2xl">Submit Puzzle</h2>
                    <br />
                    <input className="block p-2 border-2 border-black text-center text-xl" type="text" placeholder="Name" required value={formData.name}
                        maxLength={64}
                        onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                    <br />
                    <label className="block p-2 border-2 border-black text-center text-xl">
                        <input type="checkbox" checked={formData.unlisted}
                            onChange={(event) => setFormData({ ...formData, unlisted: event.target.checked })} />
                        Unlisted
                    </label>
                    <button className="p-2 border-2 border-black text-2xl bg-white" type="submit">Submit</button>
                </form>
            </div>}
            <div className="flex flex-col items-center justify-center">
                <header className="py-8 px-8 font-semibold text-5xl mb-20 text-center">Custom Puzzle</header>
                <div className="flex flex-row justify-between items-center w-96">
                    <button className="relative w-8 h-8 lg:w-12 lg:h-12 border-2 border-black bg-gray-200">
                        <div className="w-full h-full" style={{ backgroundColor: selectedColor === null ? '' : selectedColor }} onClick={() => setPickerOpen(!pickerOpen)}></div>
                        {pickerOpen && <BlockPicker className="absolute top-14 left-1/2 -translate-x-1/2 z-20" onChangeComplete={handleChangeComplete} color={selectedColor} />}
                    </button>
                    <div className="flex flex-row items-center justify-center">
                        <button className="border-2 border-black w-8 h-8 lg:w-12 lg:h-12 bg-gray-300 grid place-items-center disabled:opacity-70"
                            onClick={() => (setWidth(width - 1), setHeight(height - 1))}
                            disabled={width <= 4 || height <= 4}>
                            <img src="./minus.svg" alt="" width="24" />
                        </button>
                        <div className="text-3xl mx-4">
                            {width}x{height}
                        </div>
                        <button className="border-2 border-black w-8 h-8 lg:w-12 lg:h-12 bg-gray-300 grid place-items-center disabled:opacity-70"
                            onClick={() => (setWidth(width + 1), setHeight(height + 1))}
                            disabled={width >= 15 || height >= 15}
                        >
                            <img src="./plus.svg" alt="" width="24" />
                        </button>
                    </div>

                    <button className="text-xl font-semibold border-2 border-black w-8 h-8 lg:w-12 lg:h-12 bg-gray-300"
                        onClick={() => setGrid(createEmptyGrid(width, height))}
                    > ⟳
                    </button>
                </div>
                <table className="relative my-20">
                    <tbody>
                        {grid.map((row, i) =>
                            <tr key={`row-${i}`}>
                                {row.map((cell, j) => (
                                    <td key={`cell-${i}-${j}`} className={`border-[1px] border-gray-600 relative`} style={{ backgroundColor: cell !== null ? cell : 'rgba(25, 25, 25, 1)', width: cellSize, height: cellSize }}
                                        onPointerOver={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerOver(event, i, j)}
                                        onPointerDown={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerDown(event, i, j)}
                                    ></td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="w-24 text-center text-xl font-semibold border-2 border-black py-2 bg-gray-300"
                    onClick={() => setNameModalOpen(true)}
                > Submit
                </button>
            </div>
        </>
    );
};

export default Editor;
