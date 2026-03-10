module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 45000,
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    }
  },
  urls: [process.env.PA11Y_URL || 'http://127.0.0.1:4173/index.html']
};
