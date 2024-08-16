# Configuração do OpenVidu e Deployment do Docker

## Sumário

- Configuração do OpenVidu
- Deployment do Docker
- Comandos Úteis
- Configuração do OpenVidu
- Este documento descreve como configurar o servidor OpenVidu no IP 176.9.80.48.

## Pré-requisitos

- Um servidor rodando Ubuntu 24.
- Acesso SSH ao servidor.
- Docker e Docker Compose instalados no servidor.

## Passos de Configuração
### Acesso ao Servidor:

Conecte-se ao servidor 176.9.80.48 via SSH:

`ssh root@176.9.80.48`

### Instalação do Docker e Docker Compose:

Se ainda não estiverem instalados, siga os comandos abaixo para instalar o Docker e Docker Compose:

## Instalar o Docker
`apt update`

`apt install -y docker.io`

## Instalar o Docker Compose
`apt install -y docker-compose`

## Configuração do OpenVidu:

Crie um diretório para o OpenVidu:

`mkdir -p /opt/openvidu`

`cd /opt/openvidu`

## Iniciar o OpenVidu:

## Execute o comando para iniciar o OpenVidu:

`docker-compose up -d`

## Verificação:

 - Verifique se as credenciais no arquivo .env na pasta /opt/openvidu no servidor está configurado conforme arquivos local.env e production.env da pasta be

# Deployment do Docker para ambiente do usuário
Este documento descreve como fazer o deployment do seu projeto utilizando Docker no servidor 78.46.136.78.

## Pré-requisitos
Um servidor rodando Ubuntu (ou uma distribuição similar).

Docker e Docker Compose instalados no servidor.

Repositório Git configurado com os arquivos necessários.

## Passos de Configuração

## Acesso ao Servidor:

Conecte-se ao servidor 78.46.136.78 via SSH:

`ssh root@78.46.136.78`

## Clonar o Repositório:

`git clone <https://seu-repositorio.git>`

`cd seu-repositorio`

## Configuração do Docker Compose:

Utilize os arquivos do Docker presentes na pasta docker, docker-compose.yml para desenvolvimento e docker-compose.prod.yml para produção.

## Rodar o Deployment:

### Execute o comando abaixo para rodar o deployment do Docker:

`npm run deploy`

Este comando executará os passos necessários para iniciar todos os serviços Docker configurados no servidor.


## Parar os Containers:

`npm run docker:down`

