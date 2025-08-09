#!/usr/bin/env bash

set -euo pipefail

# Configurações
CONTAINER_NAME="craftcity-app"
IMAGE_NAME="craftcity-next"
SERVER_IP="${SERVER_IP:-72.60.5.174}"  # IP padrão, pode ser sobrescrito
PORT="${PORT:-3000}"

# Escolhe o modo: dev (default) ou prod
MODE="${2:-dev}"

# Define as variáveis de ambiente baseadas no modo
if [[ "$MODE" == "prod" ]]; then
  NEXTAUTH_URL="https://$SERVER_IP"
  NODE_ENV="production"
  echo "🚀 Modo PRODUÇÃO - NEXTAUTH_URL: $NEXTAUTH_URL"
else
  NEXTAUTH_URL="http://localhost:$PORT"
  NODE_ENV="development"
  echo "🛠️  Modo DESENVOLVIMENTO - NEXTAUTH_URL: $NEXTAUTH_URL"
fi

# Verificações rápidas
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker não encontrado. Instale o Docker."
  exit 1
fi

case "${1:-}" in
  build)
    echo "🔧 Construindo imagem Docker ($MODE)..."
    docker build \
      --build-arg NEXTAUTH_URL="$NEXTAUTH_URL" \
      --build-arg NODE_ENV="$NODE_ENV" \
      -t $IMAGE_NAME .
    ;;

  start)
    echo "🚀 Iniciando container ($MODE)..."
    docker run -d \
      -p $PORT:3000 \
      --name $CONTAINER_NAME \
      -e NEXTAUTH_URL="$NEXTAUTH_URL" \
      -e NODE_ENV="$NODE_ENV" \
      $IMAGE_NAME
    ;;

  stop)
    echo "🛑 Parando container..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    ;;

  restart)
    echo "🔄 Reiniciando container ($MODE)..."
    $0 stop
    $0 build $MODE
    $0 start $MODE
    ;;

  status)
    echo "📊 Status do container:"
    docker ps -a | grep $CONTAINER_NAME || echo "Container não encontrado"
    ;;

  logs)
    echo "📄 Logs (CTRL+C para sair):"
    docker logs -f $CONTAINER_NAME
    ;;

  *)
    cat <<USAGE
Comandos disponíveis:
  ./docker-app.sh build [dev|prod]    → constrói a imagem
  ./docker-app.sh start [dev|prod]    → inicia o container  
  ./docker-app.sh stop                → para e remove o container
  ./docker-app.sh restart [dev|prod]  → reconstrói e reinicia
  ./docker-app.sh status              → mostra status do container
  ./docker-app.sh logs                → exibe logs em tempo real

Modos:
  dev  → http://localhost:$PORT (padrão)
  prod → https://$SERVER_IP

Variáveis de ambiente:
  SERVER_IP → IP do servidor (atual: $SERVER_IP)
  PORT      → Porta local (atual: $PORT)

Exemplo:
  SERVER_IP=192.168.1.100 ./docker-app.sh build prod
USAGE
    exit 1
    ;;
esac