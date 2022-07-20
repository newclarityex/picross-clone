import styles from "./Board.module.css";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import type { Level } from "@prisma/client";

interface Cell {
    value: string | null;
    selected: boolean;
}

const Board = (props: {
    levelData: Level | null;
} = {
        levelData: null,
    }) => {

    const generateEmptyGrid = (grid: (string | null)[][]): Cell[][] => {
        return grid.map((row) => row.map((value) => {
            return {
                value,
                selected: false,
            }
        }))
    }

    const [grid, setGrid] = useState<Cell[][]>([]);
    const [completed, setCompleted] = useState(false);
    const [pointerFill, setPointerFill] = useState(null as boolean | null);
    const [clues, setClues] = useState<number[][][]>([[], []]);
    const xClues = clues[0];
    const yClues = clues[1];

    useEffect(() => {
        const newGrid = generateEmptyGrid(props.levelData?.data as (string | null)[][] || []);
        setGrid(newGrid);
        setCompleted(false);
        setPointerFill(null);
        setClues(generateClues(newGrid.map(row => row.map(cell => cell.value === null ? false : true))));
    }, [props.levelData]);

    const clueFromArray = (array: boolean[]) => {
        const clue = [];
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                count++;
            } else {
                if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
        }
        if (count > 0) {
            clue.push(count);
        }
        if (clue.length === 0) {
            clue.push(0);
        }
        return clue;
    }

    const generateClues = (grid: boolean[][]) => {
        if (grid.length === 0) {
            return [[], []];
        }
        const xClues = [];
        for (let i = 0; i < grid.length; i++) {
            xClues[i] = clueFromArray(grid[i] as boolean[]);
        }
        const yClues = [];
        for (let i = 0; i < grid[0]!.length; i++) {
            yClues[i] = clueFromArray(grid.map(row => row[i]) as boolean[]);
        }
        return [xClues, yClues];
    }

    const [xCluesFullfilled, setXCluesFullfilled] = useState([] as boolean[]);
    const [yCluesFullfilled, setYCluesFullfilled] = useState([] as boolean[]);

    const checkClues = () => {
        const [newXClues, newYClues] = generateClues(grid.map(row => row.map(cell => cell.selected)));
        const newXCluesFullfilled = newXClues!.map((clues, i) => clues.length === (xClues as any)[i].length && clues.every((clue, j) => clue === (xClues as any)[i][j]));
        const newYCluesFullfilled = newYClues!.map((clues, i) => clues.length === (yClues as any)[i].length && clues.every((clue, j) => clue === (yClues as any)[i][j]));
        setXCluesFullfilled(newXCluesFullfilled);
        setYCluesFullfilled(newYCluesFullfilled);

    }

    const validateGrid = () => {
        for (let i = 0; i < grid.length; i++) {
            const row = grid[i];
            if (row === undefined) return false;
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell === undefined) return false;
                // Cell was not selected and has a value
                if (cell.selected === false && cell.value !== null) return false;
                // Cell was selected and has no value
                if (cell.selected === true && cell.value === null) return false;
            }
        }
        return true;
    }

    const changeCell = (row: number, column: number, state: boolean) => {
        if (completed) return;
        const newGrid = [...grid];
        newGrid[row]![column]!.selected = state;
        setGrid(newGrid);
        checkClues();
        if (validateGrid()) {
            setCompleted(true);
        }
    }

    const handlePointerOver = (event: React.PointerEvent<HTMLTableCellElement>, row: number, column: number) => {
        if (pointerFill === null) return;
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
            setPointerFill(cell.selected === false);
            changeCell(rowIndex, columnIndex, !cell.selected);
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
            <div>
                <table className="relative">
                    <tbody>
                        <tr>
                            <td></td>
                            {yClues?.map((clue, i) => {
                                return <td className={`text-2xl transition-colors font-semibold text-center align-bottom ${yCluesFullfilled[i] ? 'text-green-500' : 'text-red-500'}`} key={`yClue-${i}`}>
                                    {clue.map((count, j) =>
                                        <div key={`yClue-${i}-${j}`}>{count}</div>
                                    )}
                                </td>;
                            })}
                        </tr>
                        {grid.map((row, i) => {
                            return <tr className="relative" key={`row-${i}`}>
                                <td className={`text-2xl transition-colors font-semibold align-middle text-right ${xCluesFullfilled[i] ? 'text-green-500' : 'text-red-500'}`}>
                                    {xClues?.[i]?.map((count, j) =>
                                        <span key={`xClue-${i}-${j}`} className="mx-2">{count}</span>
                                    )}
                                </td>
                                {row.map((color, j) => {
                                    const row = grid[i];
                                    if (row === undefined) return null;
                                    const cell = row[j];
                                    if (cell === undefined) return null;
                                    return <td key={`cell-${i}-${j}`} className={`w-12 h-12 ${styles.block} ${!cell.selected || completed ? '' : styles.selected} border-[1px] border-gray-600`} style={{ backgroundColor: (completed && cell.value) ? cell.value : '' }}
                                        onPointerOver={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerOver(event, i, j)}
                                        onPointerDown={(event: React.PointerEvent<HTMLTableCellElement>) => handlePointerDown(event, i, j)}
                                    >
                                    </td>;
                                })}
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Board;
