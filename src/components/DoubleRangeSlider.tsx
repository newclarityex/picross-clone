import { useState } from 'react';
import styles from "./DoubleRangeSlider.module.css";

const DoubleRangeSlider = (props: {
    min: number,
    max: number,
    onChange: (lowVal: number, highVal: number) => void,
}) => {
    const [lowVal, setLowVal] = useState(props.min);
    const [highVal, setHighVal] = useState(props.max);

    return <div className="w-full h-full relative">
        <input type="range"
            className={`w-full absolute top-1/2 -translate-y-1/2 z-10 ${styles.slider}`}
            min={props.min} max={props.max} value={lowVal}
            onChange={(event) => {
                const newVal = Number(event.target.value);
                if (newVal >= highVal) return;
                setLowVal(newVal);
                props.onChange(newVal, highVal);
            }} />
        <input type="range"
            className={`w-full absolute top-1/2 -translate-y-1/2 z-10 ${styles.slider}`}
            min={props.min} max={props.max} value={highVal}
            onChange={(event) => {
                const newVal = Number(event.target.value);
                if (newVal <= lowVal) return;
                setHighVal(newVal);
                props.onChange(lowVal, newVal);
            }} />
        <div className="w-full h-full px-2 z-0">
            <div className="w-full h-full bg-cyan-400 relative rounded-full">
                <div className="absolute top-0 left-0 h-full bg-blue-500" style={{
                    left: `${(lowVal - props.min) / (props.max - props.min) * 100}%`,
                    width: `${(highVal - lowVal) / (props.max - props.min) * 100}%`,
                }}></div>
            </div>
        </div>
    </div>
};

export default DoubleRangeSlider;
