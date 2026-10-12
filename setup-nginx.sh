#!/bin/bash
# ===================================================================
# Script para configurar Nginx en el VPS de Hostinger
# Ejecutar como root en el VPS:
#   bash setup-nginx.sh
# ===================================================================
set -e

DOMAIN="centrouniversitarioexaltacion.com"
UPLOADS_DIR="/var/www/uploads"

echo "==> 1. Asegurando directorio de uploads en el host..."
mkdir -p "$UPLOADS_DIR"
chmod -R 777 "$UPLOADS_DIR"

echo "==> Configurando límite de subida a 250M en Nginx..."
mkdir -p /etc/nginx/conf.d
echo "client_max_body_size 250M;" > /etc/nginx/conf.d/upload_size.conf

echo "==> 2. Migrando uploads existentes del volumen Docker anterior (si existen)..."
VOLUME_PATH=$(docker volume inspect uploads_data --format '{{ .Mountpoint }}' 2>/dev/null || true)
if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
    echo "    Encontrado volumen anterior en: $VOLUME_PATH"
    cp -rn "$VOLUME_PATH"/* "$UPLOADS_DIR"/ 2>/dev/null || true
    chmod -R 777 "$UPLOADS_DIR"
    echo "    Archivos migrados correctamente."
else
    echo "    No se encontró volumen previo o ya fue migrado."
fi

echo "==> 3. Buscando archivo de configuración de Nginx..."
NGINX_CONF=""

for candidate in \
    "/etc/nginx/sites-available/centrouniversitario" \
    "/etc/nginx/sites-enabled/centrouniversitario" \
    "/etc/nginx/sites-available/$DOMAIN" \
    "/etc/nginx/sites-enabled/$DOMAIN" \
    "/etc/nginx/conf.d/$DOMAIN.conf" \
    "/etc/nginx/sites-available/default" \
    "/etc/nginx/sites-enabled/default" \
    "/etc/nginx/conf.d/default.conf"; do
    if [ -f "$candidate" ]; then
        NGINX_CONF="$candidate"
        break
    fi
done

if [ -z "$NGINX_CONF" ]; then
    NGINX_CONF=$(grep -rl "$DOMAIN" /etc/nginx/sites-available/ /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null | head -n 1 || true)
fi

if [ -z "$NGINX_CONF" ]; then
    NGINX_CONF=$(grep -rl "3000" /etc/nginx/sites-available/ /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null | head -n 1 || true)
fi

if [ -z "$NGINX_CONF" ]; then
    echo "AVISO: No se detectó automáticamente el archivo de configuración de Nginx."
    echo "Archivos encontrados en /etc/nginx:"
    ls -la /etc/nginx/sites-available/ 2>/dev/null || true
    ls -la /etc/nginx/conf.d/ 2>/dev/null || true
    echo "Next.js servirá los uploads mediante su handler interno como fallback."
    exit 0
fi

# Resolver symlink si apunta a sites-available
REAL_CONF=$(readlink -f "$NGINX_CONF")
echo "    Archivo encontrado: $REAL_CONF"

# Backup
cp "$REAL_CONF" "${REAL_CONF}.bak.$(date +%s)"
echo "    Backup creado."

# Configurar mediante Python para evitar problemas de sintaxis
python3 - <<EOF
import re

conf_path = "$REAL_CONF"
with open(conf_path, 'r') as f:
    content = f.read()

uploads_block = '''    # Servir uploads directamente desde disco (imagenes, videos, PDFs)
    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
    }
'''

if 'location /uploads/' in content:
    print("    Actualizando bloque 'location /uploads/' existente...")
    content = re.sub(r'location\s+/uploads/\s*\{[^}]*\}', uploads_block.strip(), content)
else:
    print("    Insertando bloque 'location /uploads/'...")
    if 'location / {' in content:
        content = re.sub(r'(location\s+/\s*\{)', uploads_block + r'\n    \1', content, count=1)
    elif 'location /' in content:
        content = re.sub(r'(location\s+/[^{]*\{)', uploads_block + r'\n    \1', content, count=1)
    else:
        content = re.sub(r'(server\s*\{)', r'\1\n' + uploads_block, content, count=1)

with open(conf_path, 'w') as f:
    f.write(content)
EOF

echo "==> 4. Verificando sintaxis de Nginx..."
if nginx -t; then
    echo "==> 5. Recargando Nginx..."
    systemctl reload nginx
    echo "✅ Nginx configurado exitosamente para servir /var/www/uploads/ directamente."
else
    echo "⚠️ Error al probar configuración de Nginx. Restaurando backup..."
    LATEST_BAK=$(ls -t "${REAL_CONF}.bak."* 2>/dev/null | head -n 1)
    if [ -n "$LATEST_BAK" ]; then
        cp "$LATEST_BAK" "$REAL_CONF"
        echo "Backup restaurado."
    fi
fi
