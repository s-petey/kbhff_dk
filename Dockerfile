FROM php:7.4-apache

# Use archived Debian sources if needed for older images
RUN sed -i 's|deb.debian.org|archive.debian.org|g' /etc/apt/sources.list \
    && sed -i '/security.debian.org/d' /etc/apt/sources.list

# Install dependencies
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install mysqli pdo_mysql zip

# Enable mod_rewrite
RUN a2enmod rewrite

# Set environment variables for Janitor
ENV APACHE_DOCUMENT_ROOT /var/www/html/theme/www

# Update Apache config
COPY apache/httpd-vhosts-docker.conf /etc/apache2/sites-available/000-default.conf
COPY apache/httpd-vhosts-docker.conf /etc/apache2/sites-enabled/000-default.conf

# Set working directory
WORKDIR /var/www/html

# Set proper permissions
RUN mkdir -p /var/www/html/theme/library/{public,private,log,debug} 2>/dev/null || true
RUN chown -R www-data:www-data /var/www/html/theme/library 2>/dev/null || true
