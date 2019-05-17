// @flow
import React from 'react';

import {DocsHeader} from 'dcme-style';
import {Link as HtmlLink} from 'dcme-style';
import {Text} from 'dcme-style';

import {Link} from 'dcme-gatsby';
import ContentNav from '../shape/ContentNav';
import Layout from '../layout/Layout';
import IndexMarkdown from './indexMdx.mdx';

export default () => <Layout>
    <DocsHeader
        title={() => <Text element="h1" modifier="sizeTera superDuper margin">react-cool-storage</Text>}
        description={() => "React hooks and hocs with a common API for storing state outside of React. Query string, local storage etc. 😎"}
        links={() => <Text><HtmlLink href="https://github.com/blueflag/react-cool-storage">github</HtmlLink> | <HtmlLink href="https://www.npmjs.com/package/react-cool-storage">npm</HtmlLink> | <Link to="/api">api documentation</Link></Text>}
    />
    <ContentNav
        content={() => <IndexMarkdown />}
        pageNav={[
            'What is it?',
            'Getting Started',
            'API Summary',
            'Development'
        ]}
    />
</Layout>;
