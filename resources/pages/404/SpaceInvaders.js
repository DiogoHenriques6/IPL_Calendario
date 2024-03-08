import React from 'react';
import {Button, Container} from "semantic-ui-react";
import {Link} from "react-router-dom";
import HeaderMenu from "../../components/Menu";
import SpaceInvaderGame from "./space_invaders";

const About = () => {
    // https://codepen.io/arcs/pen/vOwJBw
    // not working
    //const SpaceInvader = new SpaceInvaderGame();
    const initGameStart = () => {
        console.log('new game');
    };
    return (
        <>
            <HeaderMenu/>
            <div className={"center margin-y-l"}>
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <h4>A página que tentou aceder, não existe.</h4>
                <Button as={Link} to="/" color="green">
                    Ínicio
                </Button>
            </div>
            {false && (
                <Container>
                    <canvas id="space-invaders"/>
                    <p className="center">
                        Space Invadors destroyed this page! Take revenge on them!
                        <br/> Use
                        <span className="label label-danger">Space</span> to shoot and
                        <span className="label label-danger">←</span>&#160;<span className="label label-danger">→</span> to move!&#160;&#160;&#160;
                        <button className="btn btn-default btn-xs" id="restart" onClick={initGameStart}>Restart</button>
                    </p>
                </Container>
            )}
        </>
    );
};

export default About;
