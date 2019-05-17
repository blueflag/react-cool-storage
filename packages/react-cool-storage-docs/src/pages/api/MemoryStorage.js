// @flow
import React from 'react';
import {navigate} from 'gatsby';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import MemoryStorageMarkdown from './MemoryStorage.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <MemoryStorageMarkdown />}
        pageNav={[
            '# MemoryStorage',
            'Config',
            'Resources',
            'Props',
            'Outside React',
            'Example using hooks'
        ]}
    />
</Layout>;
