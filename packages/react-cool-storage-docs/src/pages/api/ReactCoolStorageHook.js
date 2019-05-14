// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import PageLayout from '../../component/PageLayout';

import {Box} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Wrapper} from 'dcme-style';

import ReactCoolStorageHookMarkdown from './ReactCoolStorageHook.mdx';

export default ({location}) => <Layout>
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <PageLayout
                content={() => <Box>
                    <Typography>
                        <ReactCoolStorageHookMarkdown location={location} />
                    </Typography>
                </Box>}
            />
        </Wrapper>
    </Box>
</Layout>;
