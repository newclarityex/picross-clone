import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";
import { BlockPicker } from 'react-color';

const Editor: NextPage = () => {
    const mutation = trpc.useMutation(["level.create"]);
    const [selectedColor, setSelectedColor] = useState('#dddddd');
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);

    const createEmptyGrid = (width: number, height: number): (string | null)[][] => {
        return new Array(height).fill(new Array(width).fill(null))
    }

    const [grid, setGrid] = useState(createEmptyGrid(width, height));
    const [gridOpacity, setGridOpacity] = useState(1);
    useEffect(() => {
        setGridOpacity(0);
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
        setTimeout(() => {
            setGridOpacity(1);
        }, 10);
    }, [width, height]);

    const changeCell = (y: number, x: number, value: string | null) => {
        if (grid[y] === undefined) return;
        if (grid[y]![x] === undefined) return;

        const newGrid = [...grid];
        newGrid[y]![x] = value;
        setGrid(newGrid);
        console.log(newGrid);

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
        }
            , { once: true });
    }, []);

    const [pickerOpen, setPickerOpen] = useState(false);
    const handleChangeComplete = (color: any) => {
        setSelectedColor(color.hex)
        setPickerOpen(false);
    }

    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [name, setName] = useState("");
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (name === "") return;
        mutation.mutate({
            name,
            data: grid
        });
        setNameModalOpen(false);
        setGrid(createEmptyGrid(width, height));
    };

    return (
        <>
            <Head>
                <title>Picross Editor</title>
                <meta name="description" content="Create custom nonogram puzzles to play and share!" />
            </Head>
            {nameModalOpen && <div className="absolute h-full w-full grid place-items-center z-40 bg-black/80">
                <form className="absolute z-10 p-4 flex flex-col items-center bg-gray-200 border-2 border-black" onSubmit={handleSubmit}>
                    <button className="absolute top-0  right-2 text-2xl" onClick={() => setNameModalOpen(false)}>x</button>
                    <h2 className="font-semibold text-2xl">Submit Puzzle</h2>
                    <br />
                    <input className="block p-2 border-2 border-black text-center text-xl" type="text" placeholder="Name" required value={name} onChange={(event) => setName(event.target.value)} />
                    <br />
                    <button className="p-2 border-2 border-black text-2xl bg-white" type="submit">Submit</button>
                </form>
            </div>}
            <div className="h-full flex flex-col items-center justify-center">
                <header className="py-8 px-8 font-semibold text-5xl mb-20 text-center">Custom Puzzle</header>
                <div className="flex flex-row justify-between items-center w-96">
                    {/* {colors.map((color, i) => (
                        <button key={i} className={`relative w-8 h-8 lg:w-12 lg:h-12 border-4 rounded-xl ${selectedColor === i ? 'border-white/50' : 'border-black/20'}`} style={{ backgroundColor: color }} onClick={
                            () => setSelectedColor(i)
                        }>
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${selectedColor === i ? 'bg-white' : ''}`}></div>
                        </button>
                    ))} */}
                    <button className="relative w-8 h-8 lg:w-12 lg:h-12 border-2 border-black bg-gray-200">
                        <div className="w-full h-full" style={{ backgroundColor: selectedColor === null ? '' : selectedColor }} onClick={() => setPickerOpen(!pickerOpen)}></div>
                        {pickerOpen && <BlockPicker className="absolute top-14 left-1/2 -translate-x-1/2 z-10" onChangeComplete={handleChangeComplete} color={selectedColor} />}
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
                <table className="relative my-20" style={{ 'opacity': gridOpacity, 'transition': gridOpacity ? 'opacity 0.5s' : '' }}>
                    <tbody>
                        {grid.map((row, i) =>
                            <tr key={`row-${i}`}>
                                {row.map((cell, j) => (
                                    <td key={`cell-${i}-${j}`} className={`w-12 h-12 border-[1px] border-gray-600 relative`} style={{ backgroundColor: cell !== null ? cell : 'rgba(25, 25, 25, 1)' }}
                                        onPointerOver={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerOver(event, i, j)}
                                        onPointerDown={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerDown(event, i, j)}
                                    ></td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex flex-row justify-between w-64">
                    <Link href="./">
                        <a className="block w-24 text-center text-xl font-semibold border-2 border-black py-2 bg-gray-300">Back</a>
                    </Link>
                    <button className="w-24 text-center text-xl font-semibold border-2 border-black py-2 bg-gray-300"
                        onClick={() => setNameModalOpen(true)}
                    > Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default Editor;
