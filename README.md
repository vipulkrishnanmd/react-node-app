# Single command infrastructure setup for a web application

For a web application, creating infrastructure including servers (on cloud), CI/CD pipeline etc is a tedious task. This project is an experiment to automate all the setups for a web application.

If the system has all the required basic tools such as Terraform and AWS CLI, a `terraform apply` command creates a CI/CD pipeline and delpoys this demo application (react + node) on AWS cloud, both as an app running on a single instance (easier) as well as on a Kubernetes cluster.

On running `terraform apply`, it creates an AWS instance and installs Jenkins on it. After installling, it automatically creates all the configuratioin in Jenkins including the pipeline and credentials.

Jenkins, then builds both front-end and backend, containerizes them and pushes to Docker Hub. 

In the 'single server instance' flow, Terraform creates a single server instance in addition to Jenkins instance. The login credentials for this instance are given to the Jenkins instance. After building and pushing the containers, Jenkins logs into the server instance, pulls the containers and runs `docker-compose` command to start the app on the instance.

In the Kubernetes flow, Terraform crates a Kubernetes cluster and Jenkins deploys the app on Kubernetes.

[Click to see the demo video](https://bit.ly/3mNPuuc)
