// @flow
import React from 'react';
import {navigate} from 'gatsby';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ReachRouterQueryStringMarkdown from './ReachRouterQueryString.mdx';

export default ({location}) => {
    return <Layout>
        <ContentNav
            content={() => <ReachRouterQueryStringMarkdown location={location} history={history} />}
            pageNav={[
                '# ReachRouterQueryString',
                'Config',
                'Resources',
                'Props',
                'Example using hooks'
            ]}
        />
    </Layout>;
};
