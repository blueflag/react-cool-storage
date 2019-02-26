// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import PageLayout from '../../component/PageLayout';

import {Box} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Wrapper} from 'dcme-style';

import MemoryStorageMarkdown from './MemoryStorage.mdx';

export default () => <Layout>
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <PageLayout
                content={() => <Box>
                    <Typography>
                        <MemoryStorageMarkdown />
                    </Typography>
                </Box>}
            />
        </Wrapper>
    </Box>
</Layout>;
