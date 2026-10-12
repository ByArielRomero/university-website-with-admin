#!/bin/bash
# ===================================================================
# Script para configurar Nginx en el VPS de Hostinger
# Ejecutar UNA sola vez como root en el VPS:
#   bash setup-nginx.sh
# ===================================================================
set -e

DOMAIN="centrouniversitarioexaltacion.com"
UPLOADS_DIR="/var/www/uploads"

echo "==> Creando directorio de uploads..."
mkdir -p "$UPLOADS_DIR"
# El contenedor usa un usuario no-root; el grupo permite escritura sin abrir el directorio al mundo.
chown -R 1001:1001 "$UPLOADS_DIR" 2>/dev/null || true
chmod 775 "$UPLOADS_DIR"

echo "==> Migrando uploads existentes del volumen Docker (si hay)..."
# Copiar archivos del volumen anterior si existen
VOLUME_PATH=$(docker volume inspect uploads_data --format '{{ .Mountpoint }}' 2>/dev/null || true)
if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
    echo "    Encontrado volumen en: $VOLUME_PATH"
    cp -rn "$VOLUME_PATH"/* "$UPLOADS_DIR"/ 2>/dev/null || true
    echo "    Archivos migrados."
else
    echo "    No se encontró volumen anterior, saltando migración."
fi

echo "==> Configurando Nginx..."

# Buscar el archivo de configuración del sitio
NGINX_CONF=""
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
elif [ -f "/etc/nginx/sites-available/default" ]; then
    NGINX_CONF="/etc/nginx/sites-available/default"
elif [ -f "/etc/nginx/conf.d/$DOMAIN.conf" ]; then
    NGINX_CONF="/etc/nginx/conf.d/$DOMAIN.conf"
elif [ -f "/etc/nginx/conf.d/default.conf" ]; then
    NGINX_CONF="/etc/nginx/conf.d/default.conf"
fi

if [ -z "$NGINX_CONF" ]; then
    echo "ERROR: No se encontró la configuración de Nginx."
    echo "Archivos disponibles:"
    ls /etc/nginx/sites-available/ 2>/dev/null || true
    ls /etc/nginx/conf.d/ 2>/dev/null || true
    echo ""
    echo "Agregá manualmente este bloque DENTRO del 'server { }' de tu dominio:"
    echo ""
    echo '    # Servir uploads directamente (imágenes, videos, PDFs)'
    echo '    location /uploads/ {'
    echo "        alias $UPLOADS_DIR/;"
    echo '        expires 30d;'
    echo '        add_header Cache-Control "public, immutable";'
    echo '        add_header Access-Control-Allow-Origin *;'
    echo '    }'
    echo ""
    echo '    client_max_body_size 512M;'
    echo '    client_body_timeout 600s;'
    echo '    proxy_read_timeout 600s;'
    echo '    proxy_send_timeout 600s;'
    exit 1
fi

echo "    Archivo de configuración: $NGINX_CONF"
echo "    Haciendo backup..."
cp "$NGINX_CONF" "${NGINX_CONF}.bak.$(date +%s)"

# Verificar si ya tiene la directiva de uploads
if grep -q "location /uploads/" "$NGINX_CONF"; then
    echo "    Ya existe un bloque 'location /uploads/' — actualizando..."
    # Reemplazar el bloque existente con sed
    sed -i '/location \/uploads\//,/}/c\
    # Servir uploads directamente (imágenes, videos, PDFs)\
    location /uploads/ {\
        alias /var/www/uploads/;\
        expires 30d;\
        add_header Cache-Control "public, immutable";\
        add_header Access-Control-Allow-Origin *;\
    }' "$NGINX_CONF"
else
    echo "    Insertando bloque 'location /uploads/' en la configuración..."
    # Insertar ANTES de la primera 'location /' que proxea a Next.js
    sed -i '/location \/ {/i\
    # Servir uploads directamente (imágenes, videos, PDFs)\
    location /uploads/ {\
        alias /var/www/uploads/;\
        expires 30d;\
        add_header Cache-Control "public, immutable";\
        add_header Access-Control-Allow-Origin *;\
    }\
' "$NGINX_CONF"
fi

# Agregar client_max_body_size si no existe
if ! grep -q "client_max_body_size" "$NGINX_CONF"; then
    echo "    Agregando límites de carga y proxy..."
    sed -i '/server {/a\    client_max_body_size 512M;
    client_body_timeout 600s;
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;' "$NGINX_CONF"
fi

echo "==> Verificando configuración de Nginx..."
nginx -t

echo "==> Recargando Nginx..."
systemctl reload nginx

echo ""
echo "✅ ¡Nginx configurado! Las imágenes en /var/www/uploads/ se sirven directamente."
echo ""
echo "Ahora ejecutá:"
echo "  cd /var/www/university-website-with-admin"
echo "  git pull"
echo "  docker-compose down"
echo "  docker-compose build --no-cache web"
echo "  docker-compose up -d"
