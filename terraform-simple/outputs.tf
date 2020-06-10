output "jenkins_address" {
  value = aws_instance.jenkins-instance_new.public_dns
}

output "server_address" {
  value = aws_instance.server_new.public_dns
}

output "private_key" {
    value = tls_private_key.common.private_key_pem
}

# output "rendered_template" {
#  value = data.template_file.jenkins_setup.rendered
# }