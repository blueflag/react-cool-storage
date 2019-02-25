// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import PageLayout from '../../component/PageLayout';

import {Box} from 'dcme-style';
import {Link as HtmlLink} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Wrapper} from 'dcme-style';

import WebStorageMarkdown from './web-storageMdx.mdx';

export default () => <Layout>
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <PageLayout
                content={() => <Box>
                    <Typography>
                        <WebStorageMarkdown />
                    </Typography>
                </Box>}
                nav={() => <NavigationList>
                    <NavigationListItem><HtmlLink href={`#What-is-it`}>What is it?</HtmlLink></NavigationListItem>
                    <NavigationListItem><HtmlLink href={`#Getting-Started`}>Getting Started</HtmlLink></NavigationListItem>
                    <NavigationListItem><HtmlLink href={`#API`}>API</HtmlLink></NavigationListItem>
                </NavigationList>}
            />
        </Wrapper>
    </Box>
</Layout>;
