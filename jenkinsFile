pipeline {
    agent any

    environment {
        BUILD_NUMBER_ID = "${env.BUILD_NUMBER ?: '0'}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // משיכת הקוד ממאגר ה־Version Control (Git/GitHub)
                checkout scm
            }
        }

        stage('Extract Git Commit') {
            steps {
                script {
                    // חילוץ 7 התווים הראשונים של מזהה הקומיט
                    env.COMMIT_SHA = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
                    echo "Current Commit SHA: ${env.COMMIT_SHA}"
                }
            }
        }

        stage('Run Tests & Coverage Gate') {
            steps {
                script {
                    // בדיקה והתקנה אוטומטית של Node.js במידת הצורך והרצת בדיקות בתיקיית ה־API
                    dir('api') {
                        sh 'node -v || (apt-get update && apt-get install -y nodejs npm)'
                        sh 'npm install'
                        sh "npm test -- --coverage --coverageThreshold='{\"global\":{\"lines\":80}}'"
                    }
                    
                    // הרצת בדיקות יחידה ואכיפת שער כיסוי 80% בתיקיית ה־Web
                    dir('web') {
                        sh 'npm install'
                        sh "npm test -- --coverage --coverageThreshold='{\"global\":{\"lines\":80}}'"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            when {
                // בניית תמונות Docker מתבצעת אך ורק בענף ה־main או master
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
                // פריסה מלאה לאוויר תתבצע אך ורק בענף ה־main או master
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
            echo "Pipeline failed! Quality Gate or Build condition was not met."
        }
    }
}