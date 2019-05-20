// @flow
const {gatsbyConfig} = require('dcme-gatsby/lib/gatsby/gatsby-config');

module.exports = {
    pathPrefix: '/react-cool-storage',
    siteMetadata: {
        title: 'React Cool Storage'
    },
    ...gatsbyConfig
};
