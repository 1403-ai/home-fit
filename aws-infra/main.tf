data "aws_vpc" "default" {
  default = true
}

data "aws_ec2_instance_type_offerings" "supported" {
  filter {
    name   = "instance-type"
    values = [var.instance_type]
  }
  location_type = "availability-zone"
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "availability-zone"
    values = data.aws_ec2_instance_type_offerings.supported.locations
  }
}

locals {
  is_arm64  = can(regex("^(t4g|c7g|m7g|r7g|a1|c6g|m6g|r6g|x2g|im4gn|is4gen|i4g)", var.instance_type))
  ami_arch  = local.is_arm64 ? "arm64" : "x86_64"
  compose_arch = local.is_arm64 ? "aarch64" : "x86_64"
}

data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-${local.ami_arch}"
}

resource "tls_private_key" "ec2" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ec2" {
  key_name   = "${var.name_prefix}-key"
  public_key = tls_private_key.ec2.public_key_openssh
}

resource "local_sensitive_file" "private_key" {
  content         = tls_private_key.ec2.private_key_pem
  filename        = "${path.module}/${var.name_prefix}-key.pem"
  file_permission = "0600"
}

resource "aws_security_group" "ec2" {
  name        = "${var.name_prefix}-sg"
  description = "home-fit deploy: SSH + HTTP + HTTPS"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH from GitHub Actions"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ingress_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name_prefix}-sg"
  }
}

resource "aws_instance" "ec2" {
  ami                         = data.aws_ssm_parameter.al2023.value
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.ec2.key_name
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  subnet_id                   = data.aws_subnets.default.ids[0]
  associate_public_ip_address = true
  user_data = templatefile("${path.module}/user-data.sh", {
    compose_arch = local.compose_arch
  })

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    volume_size = var.root_volume_gb
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.name_prefix}-aidlc"
  }
}
