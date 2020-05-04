pipeline {
    agent any
       triggers {
        pollSCM "* * * * *"
       }
    stages {
        stage('Build Docker Image for Backend') {
            when {
                branch 'master'
            }
            steps {
                echo '=== Building Backend Docker Image ==='
                script {
                    app_backend = docker.build("vipulkrishnanmd/react-node-app")
                }
            }
        }
        stage('Build Docker Image for Frontend') {
            when {
                branch 'master'
            }
            steps {
                echo '=== Building Frontend Docker Image ==='
                script {
                    app_frontend = docker.build("vipulkrishnanmd/react-node-app-webapp", "./webapp")
                }
            }
        }
        stage('Push Backend Docker Image') {
            when {
                branch 'master'
            }
            steps {
                echo '=== Pushing Image ==='
                script {
                    GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
                    SHORT_COMMIT = "${GIT_COMMIT_HASH[0..7]}"
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerHubCredentials') {
                        app_backend.push("$SHORT_COMMIT")
                        app_backend.push("latest")
                    }
                }
            }
        }
        stage('Push Frontend Docker Image') {
            when {
                branch 'master'
            }
            steps {
                echo '=== Pushing Image ==='
                script {
                    GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
                    SHORT_COMMIT = "${GIT_COMMIT_HASH[0..7]}"
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerHubCredentials') {
                        app_frontend.push("$SHORT_COMMIT")
                        app_frontend.push("latest")
                    }
                }
            }
        }
        stage('Remove local images') {
            steps {
                echo '=== Delete the local docker images ==='
                sh("docker rmi -f vipulkrishnanmd/react-node-app:latest || :")
                sh("docker rmi -f vipulkrishnanmd/react-node-app:$SHORT_COMMIT || :")
                sh("docker rmi -f vipulkrishnanmd/react-node-app/webapp:latest || :")
                sh("docker rmi -f vipulkrishnanmd/react-node-app/webapp:$SHORT_COMMIT || :")
            }
        }
        stage('Deploy (docker-compose') {
            steps {
                echo '== re-running docker compose up'
                // sh("sudo ssh -o StrictHostKeyChecking=no -i /home/ec2-user/.ssh/two.pem ubuntu@ec2-18-234-79-198.compute-1.amazonaws.com 'cd app'")
                sshagent (credentials: ['deploy-dev']) {
                    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ec2-18-234-79-198.compute-1.amazonaws.com "cd app; sudo docker-compose up"'
                }
            }
        }
    }
}