pipeline {
    agent any

    stages {
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                sh "docker build -t reservant-front:latest ."
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh "docker stop skalmar && docker rm skalmar || true"
                sh "docker run --detach --restart=on-failure -v	skalmar_nginx_config:/etc/nginx/conf.d --name skalmar -e REACT_APP_SERVER_IP=http://172.21.40.127:12038 -p 800:80 reservant-front"
            }
        }
    }
}
