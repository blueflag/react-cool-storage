// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ReactCoolStorageHocMarkdown from './ReactCoolStorageHoc.mdx';

export default ({location}) => <Layout>
    <ContentNav
        content={() => <ReactCoolStorageHocMarkdown location={location} />}
        pageNav={[
            '# ReactCoolStorageHoc',
            'Example usage',
            'Arguments',
            'Returns',
            '# ReactCoolStorageMessage',
            'ReactCoolStorageMessage'
        ]}
    />
</Layout>;
