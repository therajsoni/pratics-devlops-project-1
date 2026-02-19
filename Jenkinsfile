pipeline {
    agent any

    parameters {

        string(
            name: 'REPO_URL',
            defaultValue: 'https://github.com/therajsoni/pratics-devlops-project-1.git',
            description: 'Default repo use hoga. Agar dusra repo build karna ho to URL change kare.'
        )

        activeChoiceReactiveParam('BRANCH_NAME') {
            description('Select branch from repository')
            choiceType('SINGLE_SELECT')
            groovyScript {
                script("""
                    def repo = REPO_URL?.trim()
                    if (!repo) {
                        return ['main']
                    }

                    def branches = []
                    try {
                        def process = "git ls-remote --heads ${repo}".execute()
                        process.waitFor()

                        process.in.text.eachLine { line ->
                            def branch = line.tokenize()[1].replaceAll('refs/heads/', '')
                            branches << branch
                        }

                        if (branches.isEmpty()) {
                            branches = ['main']
                        }

                        return branches.sort()
                    } catch (Exception e) {
                        return ['main']
                    }
                """)
                fallbackScript("return ['main']")
            }
        }

        booleanParam(
            name: 'USE_CREDENTIALS',
            defaultValue: false,
            description: 'Private repo ke liye enable kare'
        )
    }

    environment {
        GIT_CREDS = 'github-creds'   // credentials ID (optional use)
    }

    stages {

        stage('Checkout Code') {
            steps {
                script {

                    def repoToUse = params.REPO_URL?.trim()
                    def branchToBuild = params.BRANCH_NAME?.trim()

                    if (!branchToBuild) {
                        branchToBuild = 'main'
                    }

                    echo "Using Repo: ${repoToUse}"
                    echo "Using Branch: ${branchToBuild}"

                    if (params.USE_CREDENTIALS) {

                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "*/${branchToBuild}"]],
                            userRemoteConfigs: [[
                                url: "${repoToUse}",
                                credentialsId: "${GIT_CREDS}"
                            ]]
                        ])

                    } else {

                        git branch: "${branchToBuild}",
                            url: "${repoToUse}"
                    }
                }
            }
        }
    }
}

