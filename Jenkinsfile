pipeline {
    agent any
    stages {
        stage("Build Docker Image") {
            steps {
                sh 'docker build -t michelmorin/michelmorin-website:latest .'
            }
        }
        stage("Push Docker Image") {
            steps {
                sh 'docker push michelmorin/michelmorin-website:latest'
            }
        }
    }
}
