// @flow
import React from 'react';
import {Box, CenteredLanding, Grid, GridItem, Link as HtmlLink, NavigationList, NavigationListItem, Text, Typography, Wrapper} from 'dcme-style';
import Link from '../component/Link';
import PageLayout from '../component/PageLayout';
import Layout from '../layout/Layout';
import IndexMarkdown from './indexMdx.mdx';

export default () => <Layout>
    <Box modifier="invertedCopy invertedBackground">
        <Wrapper>
            <CenteredLanding
                modifier="heightHalf"
                top={() => <Text element="h1" modifier="sizeTera superDuper margin">react-cool-storage</Text>}
                bottom={() => <Grid>
                    <GridItem modifier="8 padding">
                        <Text element="p" modifier="monospace margin">React hooks and hocs with a common API for storing state outside of React. Query string, local storage etc. 😎</Text>
                        <Text element="p" modifier="monospace"><HtmlLink href="https://github.com/blueflag/react-cool-storage">github</HtmlLink> | <HtmlLink href="https://www.npmjs.com/package/react-cool-storage">npm</HtmlLink> | <Link to="#API">api documentation</Link></Text>
                    </GridItem>
                    <GridItem modifier="4 padding">
                    </GridItem>
                </Grid>}
            />
        </Wrapper>
    </Box>
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
