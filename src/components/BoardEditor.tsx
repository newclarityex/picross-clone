import { useEffect, useState } from "react";
import config from "../utils/config.json";
import { trpc } from "../utils/trpc";

const BoardEditor = () => {
    const mutation = trpc.useMutation(["level.create"]);
    const colors = config.colors as string[];
    const [selectedColor, setSelectedColor] = useState(0);
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
            const filling = cell === null ? (colors[selectedColor] as string) : null;
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

    return (
        <>
            <div className="flex flex-col items-center mb-8">
                <div className="flex flex-row justify-between w-[300px] lg:w-[420px]">
                    {colors.map((color, i) => (
                        <button key={i} className={`relative w-8 h-8 lg:w-12 lg:h-12 border-4 rounded-xl ${selectedColor === i ? 'border-white/50' : 'border-black/20'}`} style={{ backgroundColor: color }} onClick={
                            () => setSelectedColor(i)
                        }>
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${selectedColor === i ? 'bg-white' : ''}`}></div>
                        </button>
                    ))}
                </div>
                <table className="relative" style={{ 'opacity': gridOpacity, 'transition': gridOpacity ? 'opacity 0.5s' : '' }}>
                    <tbody>
                        {grid.map((row, i) =>
                            <tr key={`row-${i}`}>
                                {row.map((cell, j) => (
                                    <td key={`cell-${i}-${j}`} className={`w-12 h-12 border-[1px] border-gray-600`} style={{ backgroundColor: cell !== null ? cell : 'rgba(25, 25, 25, 1)' }}
                                        onPointerOver={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerOver(event, i, j)}
                                        onPointerDown={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerDown(event, i, j)}
                                    ></td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex flex-row text-3xl items-center w-64 justify-between mb-8">
                    <button className="border-2 border-black px-2 py-2 bg-gray-300"
                        onClick={() => (setWidth(width - 1), setHeight(height - 1))}
                        disabled={width <= 5 || height <= 5}>
                        <img src="./minus.svg" alt="" width="24" />
                    </button>
                    <div>
                        {width}x{height}
                    </div>
                    <button className="border-2 border-black px-2 py-2 bg-gray-300"
                        onClick={() => (setWidth(width + 1), setHeight(height + 1))}
                        disabled={width <= 15 || height <= 15}
                    >
                        <img src="./plus.svg" alt="" width="24" />
                    </button>
                </div>
                <div className="flex flex-row">
                    <button className="text-xl font-semibold border-2 border-black px-2 py-2 bg-gray-300 mx-4"
                        onClick={() => setGrid(createEmptyGrid(width, height))}
                    > Reset
                    </button>
                    <button className="text-xl font-semibold border-2 border-black px-2 py-2 bg-gray-300 mx-4"
                    > Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default BoardEditor;
