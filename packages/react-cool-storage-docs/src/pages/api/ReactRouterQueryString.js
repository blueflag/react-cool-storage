// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import PageLayout from '../../component/PageLayout';
import {navigate} from 'gatsby';

import {Box} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Wrapper} from 'dcme-style';

import ReactRouterQueryStringMarkdown from './ReactRouterQueryString.mdx';

export default ({location}) => {
    let history = {
        push: (to) => navigate(`${location.pathname}${to}`),
        replace: (to) => navigate(`${location.pathname}${to}`, {replace: true})
    };

    return <Layout>
        <Box modifier="paddingTopKilo">
            <Wrapper modifier="marginBottom">
                <PageLayout
                    content={() => <Box>
                        <Typography>
                            <ReactRouterQueryStringMarkdown location={location} history={history} />
                        </Typography>
                    </Box>}
                />
            </Wrapper>
        </Box>
    </Layout>;
};
