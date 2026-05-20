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

# =============================================================================
# PDF Pipeline Infrastructure Variables
# =============================================================================

# --- Networking ---

variable "private_subnet_cidr_a" {
  description = "CIDR block for private subnet A (Lambda + DocumentDB)"
  type        = string
  default     = "172.31.96.0/20"
}

variable "private_subnet_cidr_b" {
  description = "CIDR block for private subnet B (DocumentDB subnet group)"
  type        = string
  default     = "172.31.112.0/20"
}

# --- S3 ---

variable "s3_bucket_name" {
  description = "S3 bucket name for PDF documents"
  type        = string
  default     = "home-fit-documents"
}

# --- Lambda ---

variable "lambda_memory_size" {
  description = "Lambda function memory in MB"
  type        = number
  default     = 1024
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 900
}

# --- DocumentDB ---

variable "docdb_master_username" {
  description = "DocumentDB master username"
  type        = string
  default     = "homefit_admin"
}

variable "docdb_master_password" {
  description = "DocumentDB master password"
  type        = string
  sensitive   = true
}

variable "docdb_instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"
}

# --- Bedrock ---

variable "bedrock_model_id" {
  description = "Bedrock model ID for PDF analysis"
  type        = string
  default     = "us.anthropic.claude-opus-4-0-20250514"
}
