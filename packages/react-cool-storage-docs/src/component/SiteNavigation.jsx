// @flow
import React from "react";
import {NavigationList, NavigationListItem} from 'dcme-style';
import Link from './Link';

export default () => <NavigationList modifier="margin">
    <NavigationListItem>
        <Link to="/">React Cool Storage</Link>
    </NavigationListItem>
    <NavigationListItem>
        <a className="Link" href="https://github.com/blueflag/react-cool-storage">Github</a>
    </NavigationListItem>
</NavigationList>;
