import React from 'react';
import {Container, Header, Icon, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

const About = () => {
    return (
        <Container>
            <Segment raised placeholder textAlign="center" color='green'>
                <Header as="h2" content="Créditos V3 - 2021/2022:"/>
                <p>
                    <a href='https://github.com/mrgriever93' target="_blank">
                        <Icon name="github"/>
                    </a>
                    <a href='https://www.linkedin.com/in/alexandre-santos-5779429a/' target="_blank">
                        <Icon name="linkedin"/>
                    </a>
                    {' '}
                    Alexandre Santos - 2181593
                </p>
                <p>
                    <a href='https://github.com/SrPatinhas' target="_blank">
                        <Icon name="github"/>
                    </a>
                    <a href='https://www.linkedin.com/in/miguelcerejo/' target="_blank">
                        <Icon name="linkedin"/>
                    </a>
                    {' '}
                    Miguel Cerejo - 2192779
                </p>
            </Segment>
            <Segment placeholder textAlign="center" color='orange'>
                <Header as="h2" content="Créditos V2 - 2020/2021:"/>
                <p>Francisco Fernandes - 2161349</p>
                <p>
                    <a href='https://github.com/RafaelFerreiraTVD' target="_blank">
                        <Icon name="github"/>
                    </a>
                    <a href='https://www.linkedin.com/in/rafaelferreiratvd/' target="_blank">
                        <Icon name="linkedin"/>
                    </a>
                    {' '}
                    Rafael Ferreira - 2171636
                </p>
            </Segment>
            <Segment placeholder textAlign="center" color='red'>
                <Header as="h2" content="Créditos V1 - 2019/2020:"/>
                <p>Bruno Pereira - 2171193</p>
                <p>Tiago Lourenço - 2151564</p>
            </Segment>
        </Container>
    );
};

export default About;
