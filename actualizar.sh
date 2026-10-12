#!/bin/bash
# ===================================================================
# SCRIPT DE ACTUALIZACIÓN Y DESPLIEGUE AUTOMÁTICO EN EL VPS
# Ejecutar en el VPS como root o con sudo:
#   bash actualizar.sh
# ===================================================================
set -e

echo "========================================================="
echo "   ACTUALIZANDO WEB CENTRO UNIVERSITARIO EXALTACION"
echo "========================================================="

# 1. Asegurar directorio de uploads y permisos en el host
echo "==> [1/6] Configurando carpeta /var/www/uploads..."
mkdir -p /var/www/uploads
chmod -R 777 /var/www/uploads

# 2. Bajar últimos cambios de git
echo "==> [2/6] Descargando últimos cambios desde GitHub..."
git pull origin main

# 3. Permisos en scripts
chmod +x setup-nginx.sh actualizar.sh 2>/dev/null || true

# 4. Configurar Nginx para servir uploads directamente
echo "==> [3/6] Verificando configuración de Nginx..."
bash setup-nginx.sh || true

# 5. Detectar comando docker compose
echo "==> [4/6] Detectando Docker Compose..."
if docker compose version &>/dev/null; then
    COMPOSE_CMD="docker compose"
elif which docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "Instalando Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin || apt-get install -y docker-compose
    COMPOSE_CMD="docker compose"
fi
echo "    Usando: $COMPOSE_CMD"

# 6. Reconstruir contenedor y levantar
echo "==> [5/6] Reconstruyendo contenedor de Next.js (esto puede tomar 2-3 minutos)..."
$COMPOSE_CMD down || true
$COMPOSE_CMD build --no-cache web
$COMPOSE_CMD up -d

# 7. Asegurar permisos finales
echo "==> [6/6] Asegurando permisos de lectura/escritura..."
chmod -R 777 /var/www/uploads

echo ""
echo "========================================================="
echo "   ESTADO DE LOS CONTENEDORES:"
echo "========================================================="
$COMPOSE_CMD ps

echo ""
echo "========================================================="
echo "✅ ¡DESPLIEGUE FINALIZADO CON ÉXITO!"
echo "========================================================="
