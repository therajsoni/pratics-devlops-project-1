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
    }
}

