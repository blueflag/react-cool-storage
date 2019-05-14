// @flow
import React from "react";
import {Box} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import Link from './Link';

export default () => <Box>
    <NavigationList modifier="margin">
        <NavigationListItem>
            <Link to="/">React Cool Storage</Link>
        </NavigationListItem>
        <NavigationListItem>
            <a className="Link" href="https://github.com/blueflag/react-cool-storage">Github</a>
        </NavigationListItem>
    </NavigationList>
    <NavigationList>
        <NavigationListItem><Link to="/#What-is-it">What is it?</Link></NavigationListItem>
        <NavigationListItem><Link to="/#Getting-Started">Getting Started</Link></NavigationListItem>
        <NavigationListItem><Link to="/#API">API</Link></NavigationListItem>
    </NavigationList>
    <NavigationList modifier="margin">
        <NavigationListItem>API</NavigationListItem>
    </NavigationList>
    <NavigationList modifier="margin">
        <NavigationListItem>React bindings</NavigationListItem>
        <NavigationListItem><Link to="/api/ReactCoolStorageHook">ReactCoolStorageHook</Link></NavigationListItem>
        <NavigationListItem><Link to="/api/ReactCoolStorageHoc">ReactCoolStorageHoc</Link></NavigationListItem>
    </NavigationList>
    <NavigationList modifier="margin">
        <NavigationListItem>Storage Mechanisms</NavigationListItem>
        <NavigationListItem><Link to="/api/ReachRouterQueryString">ReachRouterQueryString</Link></NavigationListItem>
        <NavigationListItem><Link to="/api/ReactRouterQueryString">ReactRouterQueryString</Link></NavigationListItem>
        <NavigationListItem><Link to="/api/WebStorage">WebStorage</Link></NavigationListItem>
        <NavigationListItem><Link to="/api/MemoryStorage">MemoryStorage</Link></NavigationListItem>
    </NavigationList>
</Box>;
