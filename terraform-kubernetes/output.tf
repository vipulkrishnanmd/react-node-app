#
# Outputs
#

locals {
  kubeconfig = <<KUBECONFIG
apiVersion: v1
clusters:
- cluster:
    server: ${aws_eks_cluster.demo.endpoint}
    certificate-authority-data: ${aws_eks_cluster.demo.certificate_authority.0.data}
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: ci
  name: ci
current-context: ci
kind: Config
preferences: {}
users:
 - name: ci
   user:
     token: ${lookup(data.kubernetes_secret.ci.data, "token")}
KUBECONFIG
}


output "kubeconfig" {
  value = local.kubeconfig
}

output "jenkins_ip_address" {
  value = "${aws_instance.jenkins-instance_new.public_dns}"
}

output "rendered_template" {
 value = "${data.template_file.jenkins_setup.rendered}"
}
