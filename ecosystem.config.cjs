/**
 * PM2: npm install -g pm2
 * Старт: pm2 start ecosystem.config.cjs --env production
 * Пътят cwd е коренът на репото на сървъра (напр. /var/www/agrinexus-geo).
 */
module.exports = {
  apps: [
    {
      name: "agrinexus-geo",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: "3001",
        // Зад nginx с HTTPS:
        // PUBLIC_HTTPS: "1",
        // PUBLIC_ORIGIN: "https://your-domain.example",
      },
    },
  ],
};
