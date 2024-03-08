import React, {useLayoutEffect} from 'react';
import {Link} from 'react-router-dom';
import {Grid, Button, Image} from 'semantic-ui-react';
import {createGlobalStyle} from 'styled-components';
import gsap from 'gsap';
import Astronaut from './Astronaut';
import logoUrl from '../../IPL_black_big.png';
import HeaderMenu from "../../components/Menu";
import {useTranslation} from "react-i18next";

const GlobalStyle = createGlobalStyle`
    :root {
        --blue: #0e0620;
        --white: #fff;
        --green: #2ccf6d;
    }
    body {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Nunito Sans";
        color: var(--blue);
        font-size: 1em;
    }
    svg {
        width: 100%;
    }
    h1 {
        font-size: 7.5em;
        margin: 15px 0px;
        font-weight: bold;
    }
    h2 {
        font-weight: bold;
    }
`;

const NotFoundPage = () => {
    const { t } = useTranslation();
    useLayoutEffect(() => {
        gsap.to('#headStripe', {
            y: 0.5,
            rotation: 1,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            duration: 1,
        });
        gsap.to('#spaceman', {
            y: 0.5,
            rotation: 1,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            duration: 1,
        });
        gsap.to('#craterSmall', {
            x: -3,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: 'sine.inOut',
        });
        gsap.to('#craterBig', {
            x: 3,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: 'sine.inOut',
        });
        gsap.to('#planet', {
            rotation: -2,
            yoyo: true,
            repeat: -1,
            duration: 1,
            ease: 'sine.inOut',
            transformOrigin: '50% 50%',
        });

        gsap.to('#starsBig g', {
            rotation: 'random(-30,30)',
            transformOrigin: '50% 50%',
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
        });
        gsap.fromTo(
            '#starsSmall g',
            {scale: 0, transformOrigin: '50% 50%'},
            {
                scale: 1,
                transformOrigin: '50% 50%',
                yoyo: true,
                repeat: -1,
                stagger: 0.1,
            },
        );
        gsap.to('#circlesSmall circle', {
            y: -4,
            yoyo: true,
            duration: 1,
            ease: 'sine.inOut',
            repeat: -1,
        });
        gsap.to('#circlesBig circle', {
            y: -2,
            yoyo: true,
            duration: 1,
            ease: 'sine.inOut',
            repeat: -1,
        });

        gsap.set('#glassShine', {x: -68});

        gsap.to('#glassShine', {
            x: 80,
            duration: 2,
            rotation: -30,
            ease: 'expo.inOut',
            transformOrigin: '50% 50%',
            repeat: -1,
            repeatDelay: 8,
            delay: 2,
        });
    }, []);

    return (
        <>
            <HeaderMenu/>
            <GlobalStyle/>
            <Grid>
                <Grid.Row centered columns="2">
                    <Grid.Column>
                        <Image as={Link} to="/" size="large" src={logoUrl}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width="8">
                        <Astronaut/>
                    </Grid.Column>
                    <Grid.Column width="8">
                        <h1>404</h1>
                        <h2>{ t("Página não encontrada") }</h2>
                        <h4>{ t("A página que tentou aceder, não existe.") }</h4>
                        <h5>{ t("Clique no botão para voltar para uma página inicial.") }</h5>
                        <Button as={Link} to="/" color="green">{ t("Ínicio") }</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default NotFoundPage;
