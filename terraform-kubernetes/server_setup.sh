#!/bin/bash
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
# Y required
# add current user to docker group so there is no need to use sudo when running docker
sudo usermod -aG docker $(whoami)

sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

cd /mnt
mkdir app
cd app
cat > docker-compose.yml <<EOF
version: '3'

services: 
    mongo:
        image: mongo
        ports:
            - "27017:27017"
        volumes: 
            - "mongodb_data_volume:/data/db"
    server:
        image: vipulkrishnanmd/react-node-app:latest
        expose: 
            - "3000"
        ports: 
            - "3000:3000"
        command: npm start
        depends_on:
            - mongo
    client:
        image: vipulkrishnanmd/react-node-app-webapp:latest
        expose:
            - "3006"
        ports:
            - "3006:3006"
        command: serve -s -p 3006 build
        stdin_open: true
        tty: true
volumes: 
    mongodb_data_volume:
EOF