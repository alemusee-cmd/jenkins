pipeline {
    agent any

    environment {
        BUILD_NUMBER_ID = "${env.BUILD_NUMBER ?: '0'}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Extract Git Commit') {
            steps {
                script {
                    env.COMMIT_SHA = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
                    echo "Current Commit SHA: ${env.COMMIT_SHA}"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    dir('api') {
                        sh 'npm install'
                        sh 'npm test'
                    }
                    dir('web') {
                        sh 'npm install'
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            when {
                expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
            }
            steps {
                script {
                    sh "docker build --build-arg BUILD_NUMBER=${env.BUILD_NUMBER_ID} --build-arg COMMIT_SHA=${env.COMMIT_SHA} -t api-service ./api"
                    sh "docker build --build-arg BUILD_NUMBER=${env.BUILD_NUMBER_ID} --build-arg COMMIT_SHA=${env.COMMIT_SHA} -t web-service ./web"
                }
            }
        }

        stage('Deploy with Docker Compose') {
            when {
                expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
            }
            steps {
                script {
                    sh 'docker compose down || true'
                    sh 'docker compose up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully for branch: ${env.BRANCH_NAME ?: 'unknown'}"
        }
        failure {
            echo "Pipeline failed! Check the logs above for more details."
        }
    }
}