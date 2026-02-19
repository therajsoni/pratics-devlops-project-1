// ====== Dynamic Parameters ======
properties([
    parameters([

        // Repo URL Parameter
        string(
            name: 'REPO_URL',
            defaultValue: 'https://github.com/therajsoni/pratics-devlops-project-1.git',
            description: 'Default GitHub Repo URL. Change only if needed.'
        ),

        // Dynamic Branch Dropdown
        [$class: 'CascadeChoiceParameter',
            name: 'BRANCH_NAME',
            description: 'Select branch dynamically from GitHub',
            choiceType: 'PT_SINGLE_SELECT',
            referencedParameters: 'REPO_URL',
            script: [
                $class: 'GroovyScript',
                script: [
                    script: '''
                        if (!REPO_URL?.trim()) {
                            return ["No Repo URL Provided"]
                        }

                        def apiUrl = REPO_URL
                            .replace("https://github.com/", "https://api.github.com/repos/")
                            .replace(".git", "/branches")

                        def branches = []

                        try {
                            def connection = new URL(apiUrl).openConnection()
                            connection.setRequestMethod("GET")
                            connection.setConnectTimeout(5000)
                            connection.setReadTimeout(5000)

                            def json = new groovy.json.JsonSlurper().parse(connection.inputStream)

                            json.each {
                                branches.add(it.name)
                            }

                        } catch(Exception e) {
                            return ["Error Fetching Branches"]
                        }

                        return branches ?: ["No Branch Found"]
                    ''',
                    sandbox: true
                ]
            ]
        ]
    ])
])

// ====== Pipeline ======
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Debug Parameters') {
            steps {
                echo "Repo URL: ${params.REPO_URL}"
                echo "Selected Branch: ${params.BRANCH_NAME}"
            }
        }

        stage('Checkout Code') {
            steps {
                script {

                    def branch = params.BRANCH_NAME?.trim()
                    if (!branch || branch.contains("Error")) {
                        branch = "master"   // fallback
                    }

                    git branch: branch,
                        credentialsId: 'github-creds',
                        url: params.REPO_URL
                }
            }
        }
    }
}
