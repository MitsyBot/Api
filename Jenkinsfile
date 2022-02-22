pipeline {
  agent any
  environment {
    GITHUB_TOKEN=credentials('github-token')
    IMAGE_NAME='mitsybot/api'
    IMAGE_VERSION='latest'
  }
  stages {

    stage('cleanup') {
      steps {
        sh 'docker system prune -a --volumes --force'
      }
    }
    stage('build image') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$IMAGE_VERSION .'
      }
    }
    stage('login to GHCR') {
      steps {
        sh 'echo $GITHUB_TOKEN_PSW | docker login ghcr.io -u $GITHUB_TOKEN_USR --password-stdin'
      }
    }
    stage('tag image') {
      steps {
        sh 'docker tag $IMAGE_NAME:$IMAGE_VERSION ghcr.io/$IMAGE_NAME:$IMAGE_VERSION'
      }
    }
    stage('push image') {
      steps {
        sh 'docker push ghcr.io/$IMAGE_NAME:$IMAGE_VERSION'
      }
    }
  stage('Enviar para a maquina') {
          steps {
            script {
                  withCredentials([sshUserPrivateKey(credentialsId: 'ssh-credentials-id', keyFileVariable: 'identity', passphraseVariable: 'passWord', usernameVariable: 'userName')]) {
                               def remote = [:]

            remote.name = 'vps'
            remote.host = '198.12.96.170'
            remote.user = userName
            remote.password = passWord
            remote.allowAnyHosts = true
            sshCommand remote: remote, command: "docker stop Api"
            sshCommand remote: remote, command: "docker rm Ai"
            sshCommand remote: remote, command: "docker image rm ghcr.io/mitsybot/api:latest"
            sshCommand remote: remote, command: "docker pull ghcr.io/mitsybot/api:latest"
            sshCommand remote: remote, command: "docker run -it -d -e JWT_SECRET='MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH30UhPNfM2uXyxDFxYD5KbjCb1FeFflzrxTgBxREgJ071694iPeSdi6gJM9z4Mn8BkLXPBtkGI6LMrKg3nGkkrQkE2f1N4td4EfkhWo6OQhdgagYon1HqGfT4azitH4DFd5UEgmtZAWB/YuA3Y5TtoLWHF5MIvxhY57qZF/w8VHAgMBAAE=' -p 1234:1234 --name Api ghcr.io/mitsybot/api:latest"
            }
        }
      } 
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}