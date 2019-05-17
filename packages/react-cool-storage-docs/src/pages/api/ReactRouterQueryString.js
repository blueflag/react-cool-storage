// @flow
import React from 'react';
import {navigate} from 'gatsby';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ReactRouterQueryStringMarkdown from './ReactRouterQueryString.mdx';

export default ({location}) => {
    let history = {
        push: (to) => navigate(`${location.pathname}${to}`),
        replace: (to) => navigate(`${location.pathname}${to}`, {replace: true})
    };

    return <Layout>
        <ContentNav
            content={() => <ReactRouterQueryStringMarkdown location={location} history={history} />}
            pageNav={[
                '# ReactRouterQueryString',
                'Config',
                'Resources',
                'Props',
                'Example using hooks'
            ]}
        />
    </Layout>;
};
