// @flow
import React from 'react';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ReactCoolStorageHookMarkdown from './ReactCoolStorageHook.mdx';

export default ({location}) => <Layout>
    <ContentNav
        content={() => <ReactCoolStorageHookMarkdown location={location} />}
        pageNav={[
            '# ReactCoolStorageHook',
            'Example usage',
            'Arguments',
            'Returns',
            '# useStorage hook',
            'Arguments',
            'Returns',
            '# ReactCoolStorageMessage',
            'ReactCoolStorageMessage'
        ]}
    />
</Layout>;
