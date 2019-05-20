// @flow
import type {Node} from "react";

import React from "react";
import Helmet from "react-helmet";
import {Head} from 'dcme-style';

import "./index.scss";

type Props = {
    children: *
};

export default ({children}: Props): Node => <div>
    <Helmet
        title="React Cool Storage"
        meta={[
            {name: "description", content: "React hooks and hocs with a common API for storing state outside of React. Query string, local storage etc. 😎"}
        ]}
    />
    <Head />
    {children}
</div>;
