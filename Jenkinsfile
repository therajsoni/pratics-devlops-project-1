pipeline {
    agent any
    options {
        skipDefaultCheckout(true)
    }

    parameters {
        string(name: 'REPO_URL',
               defaultValue: 'https://github.com/therajsoni/pratics-devlops-project-1.git',
               description: 'Repo URL')

        string(name: 'BRANCH_NAME',
               defaultValue: 'main',
               description: 'Branch name (auto filled by dropdown)')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: params.BRANCH_NAME,
                    credentialsId: 'github-creds',
                    url: params.REPO_URL
            }
        }
    }
}
