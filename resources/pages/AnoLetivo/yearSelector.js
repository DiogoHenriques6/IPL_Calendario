import React from 'react';
import {useTranslation} from "react-i18next";

const YearSelector = ({yearChange, existingYears}) => {
    const { t } = useTranslation();

    const currYear = new Date().getFullYear();
    let academicYears = [
        (currYear - 2) + "-" + (currYear - 1).toString().substring(2),
        (currYear - 1) + "-" + currYear.toString().substring(2),
        currYear + "-" + (currYear + 1).toString().substring(2),
        (currYear + 1) + "-" + (currYear + 2).toString().substring(2),
        (currYear + 2) + "-" + (currYear + 3).toString().substring(2),
    ];
    if( Object.keys(existingYears).length > 0 ) {
        academicYears = academicYears.filter((element) => !existingYears.some(e => e.display === element));
    }
    const handleYearChange = (event) => {
        yearChange(event.target.value);
    }

    return (
        <div>
            { t('ano_letivo.Ao abrir um novo ano letivo, este ficará ativo por defeito para todos os utilizadores!') }
            <br/><strong> { t('ano_letivo.Tem a certeza que deseja abrir um novo ano letivo com o seguinte código?') }</strong>
            <br/><br/>
            { academicYears.map((element) => (
                <div className="field" key={element}>
                    <div className="ui radio checkbox">
                        <input type="radio" className="hidden" value={ element } id={"radio_year_" + element } name="radio_year" onChange={handleYearChange} />
                        <label htmlFor={"radio_year_" + element}>{element}</label>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default YearSelector;
