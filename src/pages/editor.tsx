import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";
import { BlockPicker } from 'react-color';
import useMediaQuery from "../hooks/useMediaQuery";

const Editor: NextPage = () => {
    const { mutate, data, isLoading } = trpc.useMutation(["level.create"]);
    const [selectedColor, setSelectedColor] = useState('#dddddd');
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const size = (isMobile ? 250 : 400);
    const [cellSize, setCellSize] = useState(size / Math.max(width, height));

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
        setCellSize(size / Math.max(width, height))
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

    function clearGrid() {
        const newGrid = [...grid];
        for (let i = 0; i < height; i++) {
            const row = newGrid[i];
            for (let j = 0; j < width; j++) {
                if (row === undefined) continue;
                if (row[j] === undefined) continue;
                row[j] = null;
            }
        }
        setGrid(newGrid);
    }

    return (
        <>
            <Head>
                <title>Picross Editor</title>
                <meta name="description" content="Create custom nonogram puzzles to play and share!" />
            </Head>
            {data && isSaving && !isLoading && <div className="absolute h-full w-full grid place-items-center z-50 bg-black/80">
                <div className="absolute z-10 py-8 px-4 flex flex-col items-center bg-gray-200 border-2 border-black">
                    <button className="absolute top-0 right-2 text-2xl" onClick={() => setIsSaving(false)}>x</button>
                    <h1 className="text-3xl font-semibold">Level Created!</h1>
                    <h2 className="text-2xl my-2">&ldquo;{data.name}&rdquo;</h2>
                    <input className="my-2" type="text" value={`${location.protocol + '//' + location.host}/puzzle/${data.id}`} />
                    <Link href={`/puzzle/${data.id}`}>
                        <a className="text-xl text-blue-400 my-2">
                            Go to level
                        </a>
                    </Link>
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
                    <div className="block p-2 text-center text-xl mb-4">
                        <input type="checkbox" checked={formData.unlisted}
                            onChange={(event) => setFormData({ ...formData, unlisted: event.target.checked })}
                            className="mr-2" />
                        Private
                    </div>
                    <button className="p-2 border-2 border-black text-xl bg-white" type="submit">Create</button>
                </form>
            </div>}
            <div className="h-full min-h-fit flex flex-col items-center justify-evenly py-4">
                <h2 className="text-3xl lg:text-4xl my-4 text-center">Create Custom</h2>
                <div className="flex flex-row justify-between items-center">
                    <button className="relative w-8 h-8 lg:w-12 lg:h-12 border-2 border-black bg-gray-200">
                        <div className="w-full h-full" style={{ backgroundColor: selectedColor === null ? '' : selectedColor }} onClick={() => setPickerOpen(!pickerOpen)}></div>
                        {pickerOpen && <BlockPicker className="absolute top-14 left-1/2 -translate-x-1/2 z-20" onChangeComplete={handleChangeComplete} color={selectedColor} />}
                    </button>
                    <div className="flex flex-row items-center justify-center mx-8 lg:mx-16">
                        <button className="border-2 border-black w-8 h-8 lg:w-12 lg:h-12 bg-gray-300 grid place-items-center disabled:opacity-50"
                            onClick={() => (setWidth(width - 1), setHeight(height - 1))}
                            disabled={width <= 4 || height <= 4}>
                            <img src="./minus.svg" alt="" width="24" />
                        </button>
                        <div className="text-3xl mx-4">
                            {width}x{height}
                        </div>
                        <button className="border-2 border-black w-8 h-8 lg:w-12 lg:h-12 bg-gray-300 grid place-items-center disabled:opacity-50"
                            onClick={() => (setWidth(width + 1), setHeight(height + 1))}
                            disabled={width >= 15 || height >= 15}
                        >
                            <img src="./plus.svg" alt="" width="24" />
                        </button>
                    </div>

                    <button className="text-xl font-semibold border-2 border-black w-8 h-8 lg:w-12 lg:h-12 bg-gray-300"
                        onClick={clearGrid}
                    > ⟳
                    </button>
                </div>
                <table className="relative my-8 hover:cursor-pointer" style={{ userSelect: "none" }}>
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
