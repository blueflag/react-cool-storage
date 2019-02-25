// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';
import {Fragment} from 'react';

import {Box} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import {Text} from 'dcme-style';

import Link from './Link';
import PageLayout from './PageLayout';

import filter from 'unmutable/lib/filter';
import flatMap from 'unmutable/lib/flatMap';
import identity from 'unmutable/lib/identity';
import map from 'unmutable/lib/map';
import pipe from 'unmutable/lib/pipe';

type Item = {
    name: string,
    description?: Node,
    renderWith: ComponentType<*>
};

type Section = {
    title?: string,
    description?: Node,
    items: Item[]
};

type Props = {
    after?: Node,
    before?: Node,
    sections: Section[],
    name?: string
};

const getSimpleName = (name: string): string => name.replace("()","");

const renderNavigation = map((section: Section) => {

    let links = section.items.map((item: Item, key: number): Node => {
        let simpleName = getSimpleName(item.name);
        return <NavigationListItem key={key}>
            <a className="Link" href={`#${simpleName}`}>{simpleName}</a>
        </NavigationListItem>;
    });

    return <NavigationList modifier="margin">
        {section.title && <NavigationListItem>{section.title}</NavigationListItem>}
        {links}
    </NavigationList>;
});

const renderContent = pipe(
    flatMap((section: Section) => {
        let {items, title} = section;
        let elements = [];

        if(title) {
            let anchor = title
                .toLowerCase()
                .replace(/\s+/g, "_");

            elements.push(
                <Box>
                    <a name={anchor} />
                    <Text element="h2" modifier="sizeMega marginMega weightMicro">{title}</Text>
                </Box>
            );
        }

        elements = elements.concat(
            items.map((item: Item): Node => {
                let {
                    name,
                    renderWith: RenderWith = ({description}) => description
                } = item;

                let simpleName = getSimpleName(name);
                return <Box modifier="marginBottomGiga">
                    <a name={simpleName} />
                    <Text element="h3" modifier="sizeKilo marginKilo">{name}</Text>
                    <RenderWith {...item} />
                </Box>;
            })
        );

        return elements;
    }),
    filter(identity()),
    map((element, key) => <Box key={key}>{element}</Box>)
);

const renderExtra = (content) => content && <Box modifier="marginBottomGiga">{content}</Box>;

export default ({after, before, sections, name}: Props) => {
    return <PageLayout
        modifier="marginBottom"
        content={() => <Box>
            {renderExtra(before)}
            {renderContent(sections)}
            {renderExtra(after)}
        </Box>}
        nav={() => <Fragment>
            <NavigationList modifier="margin">
                <NavigationListItem><Link to="/api">Api</Link></NavigationListItem>
            </NavigationList>
            {name &&
                <NavigationList modifier="margin">
                    <NavigationListItem>{name}</NavigationListItem>
                </NavigationList>
            }
            {renderNavigation(sections)}
        </Fragment>}
    />;
};
