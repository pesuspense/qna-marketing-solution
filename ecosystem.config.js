module.exports = {
  apps: [{
    name: 'marketing-quiz',
    script: 'npm',
    args: 'run dev',
    cwd: './',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
} 