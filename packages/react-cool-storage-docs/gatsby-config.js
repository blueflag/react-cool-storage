// @flow
module.exports = {
    pathPrefix: '/react-cool-storage',
    siteMetadata: {
        title: 'React Cool Storage'
    },
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-offline',
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    `gatsby-remark-prismjs`
                ]
            }
        }
    ]
};