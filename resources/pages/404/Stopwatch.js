import React from 'react';
import HeaderMenu from "../../components/Menu";
import {Button} from "semantic-ui-react";
import {Link} from "react-router-dom";

const About = () => {
    //https://codepen.io/jh3y/pen/jOVmJBL
    return (
        <>
            <HeaderMenu/>
            <div className={"center margin-top-l"}>
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <h4>A página que tentou aceder, não existe.</h4>
                <Button as={Link} to="/" color="green">
                    Ínicio
                </Button>
            </div>
            <div className={"container-stopwatch"}>
                <form className="stopwatch">
                    <input id="start" type="checkbox"/>
                    <input id="pause" type="checkbox"/>
                    <label className="stopwatch__pause" htmlFor="pause"><span>Pause</span></label>
                    <label className="stopwatch__start" htmlFor="start"><span>Start</span></label>
                    <button className="stopwatch__reset" id="reset" type="reset"><span>Reset</span></button>
                    <div className="stopwatch__restart stopwatch__control">
                        <div className="reset-button"></div>
                    </div>
                    <div className="stopwatch__stop-start stopwatch__control">
                        <div className="start-button"></div>
                    </div>
                    <div className="stopwatch__shadows"></div>
                    <div className="stopwatch__content">
                        <div className="stopwatch__face">
                            <div className="digit m m--tens">0</div>
                            <div className="digit m m--singles">0</div>
                            <span>:</span>
                            <div className="digit second s s--tens">0</div>
                            <div className="digit second s s--singles">0</div>
                            <span>.</span>
                            <div className="digit digit--small ms ms--tens">0</div>
                            <div className="digit digit--small ms ms--singles">0</div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default About;
