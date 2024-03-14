pipeline {
    agent any

    stages {
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                sh "docker build -t reservant-front ."
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh "docker stop skalmar || true"
                sh "docker run --detach --rm --name skalmar -p 80:80 reservant-front"
            }
        }
    }
}
