# Single command infrastructure setup for a web application

For a web application, creating infrastructure including servers (on cloud), CI/CD pipeline etc is a tedious task. This project is an experiment to automate all the setups for a web application.

If the system has all the required basic tools such as terraform and aws cli, a `terraform apply` command creates a CI/CD pipeline and delpoys this demo application (react + node) on AWS cloud, both as an app running on a single instance (easier) as well as on a kubernetes cluster.
