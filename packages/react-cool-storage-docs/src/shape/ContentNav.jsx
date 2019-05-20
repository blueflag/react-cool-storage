// @flow
import React from 'react';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import {ContentNav} from 'dcme-style';
import {Link} from 'dcme-gatsby';

const nav = () => <NavigationList>
    <NavigationListItem><Link to="/">React Cool Storage</Link></NavigationListItem>
    <NavigationListItem modifier="section">React Bindings</NavigationListItem>
    <NavigationListItem><Link to="/api/ReactCoolStorageHook">ReactCoolStorageHook</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/ReactCoolStorageHoc">ReactCoolStorageHoc</Link></NavigationListItem>
    <NavigationListItem modifier="section">Storage Mechanisms</NavigationListItem>
    <NavigationListItem><Link to="/api/ReachRouterStorage">ReachRouterStorage</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/ReactRouterStorage">ReactRouterStorage</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/WebStorage">WebStorage</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/MemoryStorage">MemoryStorage</Link></NavigationListItem>
</NavigationList>;

export default (props) => <ContentNav nav={nav} {...props} />
