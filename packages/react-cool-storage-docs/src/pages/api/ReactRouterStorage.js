// @flow
import React from 'react';
import {navigate} from 'gatsby';
import Layout from '../../layout/Layout';
import ContentNav from '../../shape/ContentNav';

import ReactRouterStorageMarkdown from './ReactRouterStorage.mdx';

export default ({location}) => {
    let history = {
        push: (to) => navigate(`${location.pathname}${to}`),
        replace: (to) => navigate(`${location.pathname}${to}`, {replace: true})
    };

    return <Layout>
        <ContentNav
            content={() => <ReactRouterStorageMarkdown location={location} history={history} />}
            pageNav={[
                '# ReactRouterStorage',
                'Config',
                'Resources',
                'Props',
                'Example using hooks'
            ]}
        />
    </Layout>;
};
