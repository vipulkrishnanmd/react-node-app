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
            environment {
                server_url = readFile("/mnt/server_url")
            }
            steps {
                echo '== re-running docker compose up'
                // sh("sudo ssh -o StrictHostKeyChecking=no -i /home/ec2-user/.ssh/two.pem ubuntu@ec2-18-234-79-198.compute-1.amazonaws.com 'cd app'")
                sshagent (credentials: ['serverKey']) {
                    sh('ssh -o StrictHostKeyChecking=no ubuntu@${server_url} "cd /mnt/app;  sudo docker-compose down; sudo docker-compose pull; sudo docker-compose up --detach"')
                }
            }
        }
        stage('Deploy Kube') {
            steps {
                // kubernetesDeploy configs: '**/kubernetes/*', kubeConfig: [path: ''], kubeconfigId: 'kube', secretName: '', ssh: [sshCredentialsId: '*', sshServer: ''], textCredentials: [certificateAuthorityData: '', clientCertificateData: '', clientKeyData: '', serverUrl: 'https://']
                withCredentials([kubeconfigContent(credentialsId: 'kube', variable: 'KUBECONFIG_CONTENT')]) {
                    sh('echo "$KUBECONFIG_CONTENT" > kubeconfig')
                    sh('wget https://github.com/vipulkrishnanmd/react-node-app/archive/master.zip')
                    sh('unzip master.zip')
                    sh('kubectl --kubeconfig=kubeconfig apply -f react-node-app/kubernetes')                    
                    sh('kubectl --kubeconfig=kubeconfig apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/aws/deploy.yaml')
                    sh('rm kubeconfig')
                }
            }
        }
    }
}