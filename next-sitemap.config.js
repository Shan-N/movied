/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.movied.shannn.xyz', // Your main domain
  generateRobotsTxt: true, // Automatically generates robots.txt
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/server-sitemap.xml'], // If you ever generate server-only sitemaps
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://www.movied.shannn.xyz/sitemap.xml',
    ],
  },
};
