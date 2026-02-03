FROM php:8.3-fpm-alpine

# Dependencias del sistema
RUN apk add --no-cache git unzip icu-dev oniguruma-dev libzip-dev \
    && docker-php-ext-install intl pdo pdo_mysql mbstring zip opcache

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar composer.json y lock primero (cache Docker)
COPY composer.json composer.lock ./

# Instalar dependencias sin dev y sin scripts
RUN composer install --optimize-autoloader --no-interaction --no-scripts
# Copiar el resto del proyecto
COPY . .

# Crear directorios de cache/log y establecer permisos
RUN mkdir -p var/cache var/log \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 var/cache var/log var vendor

# Optimizar autoload
RUN composer dump-autoload --optimize

# Producción
ENV APP_ENV=prod

EXPOSE 9000
CMD ["php-fpm"]





