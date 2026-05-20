variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name (~/.aws/credentials)"
  type        = string
  default     = "aidlc"
}

variable "name_prefix" {
  description = "Resource name prefix"
  type        = string
  default     = "home-fit"
}

variable "instance_type" {
  description = "EC2 instance type (use t4g.* for arm64, t3.* for x86_64; AMI follows automatically)"
  type        = string
  default     = "t4g.medium"
}

variable "root_volume_gb" {
  description = "Root EBS volume size in GiB"
  type        = number
  default     = 20
}

variable "ssh_ingress_cidr" {
  description = "CIDR allowed to SSH (22). GitHub Actions runners need 0.0.0.0/0"
  type        = string
  default     = "0.0.0.0/0"
}
