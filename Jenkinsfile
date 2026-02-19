properties([
    parameters([
        string(
            name: 'REPO_URL',
            defaultValue: 'https://github.com/therajsoni/pratics-devlops-project-1.git',
            description: 'Default repo URL. Change only if needed.'
        ),

        [$class: 'CascadeChoiceParameter',
            name: 'BRANCH_NAME',
            description: 'Select branch dynamically from GitHub',
            choiceType: 'PT_SINGLE_SELECT',
            script: [
                $class: 'GroovyScript',
                script: [
                    script: '''
                        def repoUrl = REPO_URL
                        if (!repoUrl) {
                            return ["No Repo URL Provided"]
                        }

                        def apiUrl = repoUrl
                            .replace("https://github.com/", "https://api.github.com/repos/")
                            .replace(".git", "/branches")

                        def branches = []
                        try {
                            def connection = new URL(apiUrl).openConnection()
                            connection.setRequestMethod("GET")
                            def response = connection.inputStream.text
                            def json = new groovy.json.JsonSlurper().parseText(response)

                            json.each { branches.add(it.name) }
                        } catch(Exception e) {
                            return ["Error Fetching Branches"]
                        }

                        return branches
                    ''',
                    sandbox: true
                ]
            ]
        ]
    ])
])

pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: params.BRANCH_NAME,
                    credentialsId: 'github-creds',
                    url: params.REPO_URL
            }
        }
    }
}
