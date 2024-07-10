import React, {useCallback, useEffect, useState} from 'react';
import {Form, GridColumn, GridRow} from "semantic-ui-react";
import { Slider as SemanticSlider } from "react-semantic-ui-range";
import { Label, Grid, Input } from "semantic-ui-react";

const Slider = ({ min, max, step, value, disabled, valuePrefix, eventHandler}) => {
    const [tempValue, setTempValue] = useState(value);

    const settings = {
        start: 2,
        min: parseInt(min) ? parseInt(min) : 0,
        max: parseInt(max),
        step: 5,
        onChange: newValue => {
            setTempValue(newValue);
        },
    };

    const handleValueChange = e => {
        let auxValue = !isNaN(e.target.value) ? parseInt(e.target.value) : 0;
        switch(auxValue){
            case auxValue > 100:
                auxValue = 100;
                break;
            case auxValue < 0 || !auxValue:
                auxValue = 0;
                break;
        }
        setTempValue(auxValue);
    };

    return (
        <div>
            <Grid >
                    <Grid.Column width={6}>
                        <Input placeholder="Value" fluid type="number" value={tempValue} onChange={handleValueChange} />
                    </Grid.Column>
                    <GridColumn width={10}>
                        <SemanticSlider value={tempValue} color="blue" settings={settings}/>
                    </GridColumn>
            </Grid>
        </div>
    );
}

export default Slider;
