import React, {useState} from 'react';
import {Form} from "semantic-ui-react";

const Slider = ({ min, max, step, value, inputSide, disabled, valuePrefix, eventHandler}) => {
    const [tempValue, setTempValue] = useState(value);

    const changeSliderValue = (e) => {
        let value = e.target.value;
        if(!isNaN(value)){
            value = parseFloat(value);
            value = parseFloat((value > parseFloat(max) ? max : (value < parseFloat(min) ? min : value)));
        }
        eventHandler(value);
        setTempValue(value)
    };

    return (
        <div className={"display-flex"}>
            { inputSide === "left" && (
                <Form.Field placeholder="Peso da avaliação (%)" type="number" control="input" step={step} min={min} max={max} value={tempValue} onChange={changeSliderValue} disabled={disabled} />
            )}
            <div className={"slider-holder " + (inputSide === "left" ? "slider-input-left" : (inputSide === "right" ? "slider-input-right" : "slider-input-single"))}>
                <span className={"slider-label-min"}>{min}{valuePrefix}</span>
                <input placeholder="Peso da avaliação (%)" type="range" step={step} min={min} max={max} value={tempValue} onInput={changeSliderValue} onChange={changeSliderValue} disabled={disabled} />
                <span className={"slider-label-max"}>{max}{valuePrefix}</span>
            </div>
            { inputSide === "right" && (
                <Form.Field placeholder="Peso da avaliação (%)" type="number" control="input" step={step} min={min} max={max} value={tempValue} onChange={changeSliderValue} disabled={disabled} />
            )}
        </div>
    );
}

export default Slider;
