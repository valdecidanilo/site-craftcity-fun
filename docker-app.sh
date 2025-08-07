#!/bin/bash

CONTAINER_NAME="craftcity-app"
IMAGE_NAME="craftcity-next"

case "$1" in
  build)
    echo "🔧 Construindo imagem Docker..."
    docker build -t $IMAGE_NAME .
    ;;
  start)
    echo "🚀 Iniciando o container..."
    docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME
    ;;
  stop)
    echo "🛑 Parando o container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
    ;;
  restart)
    echo "🔄 Reiniciando container..."
    $0 stop
    $0 start
    ;;
  status)
    echo "📊 Verificando status..."
    docker ps -a | grep $CONTAINER_NAME
    ;;
  logs)
    echo "📄 Logs:"
    docker logs -f $CONTAINER_NAME
    ;;
  *)
    echo "Comandos disponíveis:"
    echo "  ./docker-app.sh build     → cria a imagem"
    echo "  ./docker-app.sh start     → sobe o container"
    echo "  ./docker-app.sh stop      → derruba o container"
    echo "  ./docker-app.sh restart   → reinicia o container"
    echo "  ./docker-app.sh status    → status do container"
    echo "  ./docker-app.sh logs      → ver logs ao vivo"
    ;;
esac
