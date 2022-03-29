module.exports = {
  apps: [{
    name: 'Service',
    script: './app.js',
    node_args: ['--max_old_space_size=5120'],
    max_memory_restart: '4G',
    listen_timeout: 10000,
    kill_timeout: 15000
  }]
};
