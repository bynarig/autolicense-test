# Deployment Guide for Autolicense-Test Next.js Application

This guide explains how to deploy the Next.js application using Nginx as a reverse proxy.

## Prerequisites

- Node.js (version 18 or higher recommended)
- PNPM (version 10.7.1 or compatible)
- Nginx (version 1.18 or higher recommended)
- SSL certificate for your domain
- A server running Linux (Ubuntu/Debian recommended)

## Building the Next.js Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd autolicense-test
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the application:
   ```bash
   pnpm build
   ```

4. Start the application in production mode:
   ```bash
   pnpm start
   ```

   This will start the Next.js server on port 3000 by default.

5. (Optional) To keep the application running after you close the terminal, use a process manager like PM2:
   ```bash
   # Install PM2
   npm install -g pm2

   # Start the application with PM2
   pm2 start npm --name "autolicense-test" -- start

   # Set PM2 to start on system boot
   pm2 startup
   pm2 save
   ```

## Setting Up Nginx

### Production Setup

1. Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Create a directory for your SSL certificates:
   ```bash
   sudo mkdir -p /etc/nginx/ssl
   ```

3. Copy your SSL certificates to the directory:
   ```bash
   sudo cp your-certificate.crt /etc/nginx/ssl/example.com.crt
   sudo cp your-private-key.key /etc/nginx/ssl/example.com.key
   ```

4. Copy the Nginx configuration file:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/autolicense-test
   ```

5. Edit the configuration file to update the domain name and paths:
   ```bash
   sudo nano /etc/nginx/sites-available/autolicense-test
   ```

   Update the following:
   - Replace `example.com` with your actual domain name
   - Update the SSL certificate paths if necessary
   - Adjust the root directory path to match your server setup

6. Create a symbolic link to enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/autolicense-test /etc/nginx/sites-enabled/
   ```

7. Test the Nginx configuration:
   ```bash
   sudo nginx -t
   ```

8. If the test is successful, restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

## Directory Structure

Ensure your production directory structure looks like this:

```
/var/www/autolicense-test/
├── .next/           # Built Next.js application
├── node_modules/    # Dependencies
├── public/          # Static files
├── package.json     # Project configuration
└── ...
```

## Troubleshooting

### 502 Bad Gateway

If you see a 502 Bad Gateway error:
- Check if the Next.js application is running on port 3000
- Verify that Nginx can connect to the application
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Issues

If you have SSL-related issues:
- Verify that your SSL certificates are valid and correctly installed
- Check that the paths in the Nginx configuration match the actual certificate locations
- Ensure the certificate files have the correct permissions

### Static Assets Not Loading

If static assets are not loading:
- Check the paths in the Nginx configuration
- Verify that the `.next/static` directory exists and is accessible
- Check for any path-related errors in the browser console

## Security Considerations

- The provided Nginx configuration includes strong security headers
- Consider setting up a firewall (e.g., UFW) to restrict access to your server
- Regularly update your server, Nginx, and Node.js to patch security vulnerabilities
- Consider using Let's Encrypt for free, auto-renewing SSL certificates

## Monitoring and Maintenance

- Set up monitoring for your application using tools like PM2, Prometheus, or a hosted service
- Regularly back up your application and database
- Set up log rotation for Nginx and application logs
