pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Extract Commit SHA') {
            steps {
                script {
                    env.COMMIT_SHA = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
                    echo "Commit: ${env.COMMIT_SHA}"
                }
            }
        }

        stage('Test & Coverage Gate') {
            steps {
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

        stage('Build Images') {
            // בונה בכל ענף (dev + main) — זו דרישת ה"בנייה" של סעיף 4
            steps {
                sh "docker build --build-arg BUILD_NUMBER=${env.BUILD_NUMBER} --build-arg COMMIT_SHA=${env.COMMIT_SHA} -t api-service ./api"
                sh "docker build --build-arg BUILD_NUMBER=${env.BUILD_NUMBER} --build-arg COMMIT_SHA=${env.COMMIT_SHA} -t web-service:${env.BUILD_NUMBER} ./web"
            }
        }

        stage('Deploy Blue-Green') {
            // רק main מעלה לאוויר; dev נעצר אחרי בנייה
            when {
                expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
            }
            steps {
                sh "BUILD_NUMBER=${env.BUILD_NUMBER} COMMIT_SHA=${env.COMMIT_SHA} bash deploy.sh"
            }
        }
    }

    post {
    always {
        junit '**/junit.xml'
    }
    success { echo "Pipeline succeeded on branch ${env.BRANCH_NAME}" }
    failure { echo "Pipeline failed on branch ${env.BRANCH_NAME}" }
    }
}