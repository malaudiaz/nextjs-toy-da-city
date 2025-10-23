module.exports = {
  siteUrl: process.env.SITE_URL || 'https://toydacity.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/config',
    '/cart',
    '/profile',
    '/login',
    '/register',
    '/api/*',
    '/admin/*',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      // Puedes agregar otros sitemaps si tienes
    ],
  },
};
