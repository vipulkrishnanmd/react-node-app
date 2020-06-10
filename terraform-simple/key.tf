resource "tls_private_key" "common" {
  algorithm   = "RSA"
}

resource "aws_key_pair" "common_key" {
  key_name   = "common_key"
  public_key = tls_private_key.common.public_key_openssh
}