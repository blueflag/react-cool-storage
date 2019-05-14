// @flow
import React from 'react';
import {Fragment} from 'react';
import {Box} from 'dcme-style';
import {CenteredLanding} from 'dcme-style';
import {Grid} from 'dcme-style';
import {GridItem} from 'dcme-style';
import {Link as HtmlLink} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import {Text} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Wrapper} from 'dcme-style';

import Link from '../component/Link';
import PageLayout from '../component/PageLayout';
import Layout from '../layout/Layout';
import IndexMarkdown from './indexMdx.mdx';

import DocsHeader from 'dcme-gatsby/lib/layout/DocsHeader';

export default () => <Layout>
    <DocsHeader
        title={() => <Text element="h1" modifier="sizeTera superDuper margin">react-cool-storage</Text>}
        description={() => "React hooks and hocs with a common API for storing state outside of React. Query string, local storage etc. 😎"}
        links={() => <Text><HtmlLink href="https://github.com/blueflag/react-cool-storage">github</HtmlLink> | <HtmlLink href="https://www.npmjs.com/package/react-cool-storage">npm</HtmlLink> | <Link to="/api">api documentation</Link></Text>}
    />
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <PageLayout
                content={() => <Box>
                    <Typography>
                        <IndexMarkdown />
                    </Typography>
                </Box>}
            />
        </Wrapper>
    </Box>
</Layout>;
