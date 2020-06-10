



data "template_file" "jenkins_setup" {
  template = file("jenkins_setup.sh.tpl")

  vars = {
    server_url = aws_instance.server_new.public_dns
    private_key = tls_private_key.common.private_key_pem
    docker_password = var.docker_password
    git_password = var.git_password
  }
}

# uncomment below code and add the passwords.
# variable "git_password" {
#     type = string
#     default = "pwd"
# }

# variable "docker_password" {
#     type = string
#     default = "pwd"
# }