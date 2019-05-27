// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ApiMarkdown from './index.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ApiMarkdown />}
        pageNav={[
            '# API',
            'React Bindings',
            'Storage Mechanisms'
        ]}
    />
</Layout>;
