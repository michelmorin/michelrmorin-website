pipeline {
    agent any
    stages {
        stage("Build Docker Image") {
            steps {
                sh 'docker build -t michelmorin/michelrmorin-website:latest .'
            }
        }
        stage("Push Docker Image") {
            steps {
                sh 'docker push michelmorin/michelrmorin-website:latest'
            }
        }
    }
}
