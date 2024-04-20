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
                sh "docker run --detach --restart=on-failure -v	skalmar_nginx_config:/etc/nginx/conf.d --name skalmar -p 80:80 reservant-front"
            }
        }
    }
}
