pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        string(
            name: 'REPO_URL',
            defaultValue: 'https://github.com/therajsoni/pratics-devlops-project-1.git',
            description: 'GitHub Repo URL'
        )
    }

    environment {
        DOCKERHUB_REPO = "rajsoni968392/frontend"
        AWS_REGION = "ap-south-1"
        ECR_REPO = "backend"
        ACCOUNT_ID = 879794963918
        ECR_REPOSITORY_NAME = "backend/store-1"
    }

    stages {

        stage('Debug') {
            steps {
                echo "Repo: ${params.REPO_URL}"
                echo "Branch: ${params.BRANCH_NAME}"
            }
        }

        stage('Checkout Code') {
            steps {
                script {
                    def branch = params.BRANCH_NAME ?: "master"

                    git branch: branch,
                        credentialsId: 'github-creds',
                        url: params.REPO_URL
                }
            }
        }

       // ================= FRONTEND =================

        stage('Get Frontend Git Tag Version') {
            steps {
                script {
                    FRONTEND_VERSION = sh(
                        script: "git describe --tags --abbrev=0 || echo build-${BUILD_NUMBER}",
                        returnStdout: true
                    ).trim()
                    echo "Frontend Version: ${FRONTEND_VERSION}"
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh """
                docker build -t ${DOCKERHUB_REPO}:${FRONTEND_VERSION} ./frontend
                docker tag ${DOCKERHUB_REPO}:${FRONTEND_VERSION} ${DOCKERHUB_REPO}:latest
                """
            }
        }

        stage('Push Frontend to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push ${DOCKERHUB_REPO}:${FRONTEND_VERSION}
                    docker push ${DOCKERHUB_REPO}:latest
                    """
                }
            }
        }

        // ================= BACKEND =================

        stage('Read Backend Version from package.json') {
            steps {
                script {
                    BACKEND_VERSION = sh(
                        script: "node -p \"require('./backend/package.json').version\"",
                        returnStdout: true
                    ).trim()
                    echo "Backend Version: ${BACKEND_VERSION}"
                }
            }
        }

        

       stage('Login to AWS & Set ECR Repo URI') {
            steps {
             withCredentials([[
                 $class: 'AmazonWebServicesCredentialsBinding',
    credentialsId: 'aws-creds'
]]) {
                script {
                    ACCOUNT_ID = sh(
                        script: "aws sts get-caller-identity --query Account --output text",
                        returnStdout: true
                    ).trim()

                    ECR_REPO_URI = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}"
                }

                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
             }  
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh """
                docker build -t ${ECR_REPO_URI}:${BACKEND_VERSION} ./backend
                docker tag ${ECR_REPO_URI}:${BACKEND_VERSION} ${ECR_REPO_URI}:latest
                """
            }
        }

        stage('Push Backend to ECR') {
            steps {
                sh """
                docker push ${ECR_REPO_URI}:${BACKEND_VERSION}
                docker push ${ECR_REPO_URI}:latest
                """
            }
        }

        stage('Deploy to Kind Cluster') {
    steps {
        sh """
        # MongoDB
        kubectl apply -f k8s/secrets.yaml
        kubectl apply -f k8s/mongodb-deployment.yaml

        # Backend
        kubectl apply -f k8s/config.yaml
        kubectl apply -f k8s/backend-deployment.yaml
        kubectl set image deployment/backend-deployment backend=${ECR_REPO_URI}:${BACKEND_VERSION} --record

        # Frontend
        kubectl apply -f k8s/frontend-deployment.yaml
        kubectl set image deployment/frontend-deployment frontend=${DOCKERHUB_REPO}:${FRONTEND_VERSION} --record
        """
    }
}

    }
}

