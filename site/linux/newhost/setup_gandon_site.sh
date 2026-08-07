#!/bin/bash

# Exit on any error
set -e

# Check if a domain name was provided
if [ -z "$1" ]; then
  echo "❌ Usage: $0 <website-name>"
  echo "Example: $0 gandon.com"
  exit 1
fi

WEBSITE="$1"
USER="al"
SRC_DIR="/home/al/Documents/logs/linux/newhost"
DST_DIR="/var/www/$WEBSITE/html"

echo "🌐 Setting up website: $WEBSITE"

# 1. Copy the virtual host config and rename it
echo "📁 Copying Apache config..."
sudo cp "$SRC_DIR/000-default.conf" "/etc/apache2/sites-available/$WEBSITE.conf"

# 2. Replace placeholders in the config
echo "📝 Replacing placeholders in the config..."
sudo sed -i "s|ServerName .*|ServerName $WEBSITE|g" "/etc/apache2/sites-available/$WEBSITE.conf"
sudo sed -i "s|ServerAdmin .*|ServerAdmin webmaster@$WEBSITE|g" "/etc/apache2/sites-available/$WEBSITE.conf"
sudo sed -i "s|ServerAlias .*|ServerAlias www.$WEBSITE|g" "/etc/apache2/sites-available/$WEBSITE.conf"
sudo sed -i "s|DocumentRoot .*|DocumentRoot $DST_DIR|g" "/etc/apache2/sites-available/$WEBSITE.conf"

# 3. Append to /etc/hosts
echo "📝 Adding '$WEBSITE' to /etc/hosts..."
echo "127.0.0.1 $WEBSITE" | sudo tee -a /etc/hosts > /dev/null

# 4. Create the site directory
echo "📂 Creating web root at $DST_DIR"
sudo mkdir -p "$DST_DIR"

# 5. Copy website content
echo "📁 Copying website files..."
sudo cp -r "$SRC_DIR/html/"* "$DST_DIR"

# 6. Set ownership
echo "🔒 Setting ownership to $USER:www-data..."
sudo chown -R "$USER:www-data" /var/www/

# 7. Set secure permissions
echo "🔧 Setting permissions..."
sudo find /var/www/ -type d -exec chmod 755 {} \;
sudo find /var/www/ -type f -exec chmod 644 {} \;

# 8. Enable the site
echo "🔗 Enabling site $WEBSITE.conf..."
sudo a2ensite "$WEBSITE.conf"

# 9. Reload Apache
echo "🔄 Reloading Apache..."
sudo systemctl reload apache2

echo "✅ Done! '$WEBSITE' is now set up."
