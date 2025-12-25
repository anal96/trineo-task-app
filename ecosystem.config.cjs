// PM2 ecosystem file for process management
// Install PM2: npm install -g pm2
// Start: pm2 start ecosystem.config.cjs
// Stop: pm2 stop ecosystem.config.cjs
// Restart: pm2 restart ecosystem.config.cjs
// Monitor: pm2 monit

module.exports = {
  apps: [{
    name: 'trineo-tasks',
    script: 'server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};

