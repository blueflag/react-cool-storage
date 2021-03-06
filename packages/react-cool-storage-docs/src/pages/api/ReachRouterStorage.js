// @flow
import React from 'react';
import {navigate} from 'gatsby';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ReachRouterStorageMarkdown from './ReachRouterStorage.mdx';

export default ({location}) => {
    return <Layout>
        <ContentNav
            content={() => <ReachRouterStorageMarkdown location={location} />}
            pageNav={[
                '# ReachRouterStorage',
                'Config',
                'Resources',
                'Props',
                'Example using hooks'
            ]}
        />
    </Layout>;
};
