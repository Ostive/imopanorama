// PM2 Configuration - ImoPanorama Next.js
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "imopanorama",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logs
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      // Restart policy
      max_memory_restart: "1G",
      restart_delay: 5000,
      max_restarts: 10,
      // Watch (disabled in production)
      watch: false,
    },
  ],
};
