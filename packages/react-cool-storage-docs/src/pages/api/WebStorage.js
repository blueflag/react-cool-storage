// @flow
import React from 'react';
import {navigate} from 'gatsby';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import WebStorageMarkdown from './WebStorage.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <WebStorageMarkdown />}
        pageNav={[
            '# WebStorage',
            'Config',
            'Resources',
            'Props',
            'Outside React',
            'Example using hooks'
        ]}
    />
</Layout>;
