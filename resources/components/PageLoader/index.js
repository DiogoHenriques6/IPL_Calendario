import React from "react";
import {Dimmer, Loader} from "semantic-ui-react";

const PageLoader = () => {
    return (
        <Dimmer active={true} page inverted>
            <Loader>Loading</Loader>
        </Dimmer>
    );
};

export default PageLoader;
