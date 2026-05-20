output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.ec2.id
}

output "public_ip" {
  description = "Public IPv4 (use for GitHub Secret EC2_HOST)"
  value       = aws_instance.ec2.public_ip
}

output "public_dns" {
  description = "Public DNS"
  value       = aws_instance.ec2.public_dns
}

output "ssh_command" {
  description = "Local SSH command"
  value       = "ssh -i ${local_sensitive_file.private_key.filename} ec2-user@${aws_instance.ec2.public_ip}"
}

output "private_key_path" {
  description = "Generated private key (use contents for GitHub Secret EC2_SSH_KEY)"
  value       = local_sensitive_file.private_key.filename
}

output "github_secrets_hint" {
  description = "Values to register at GitHub repo Settings > Secrets > Actions"
  value = {
    EC2_HOST    = aws_instance.ec2.public_ip
    EC2_USER    = "ec2-user"
    EC2_SSH_KEY = "(cat ${local_sensitive_file.private_key.filename})"
  }
}

# =============================================================================
# PDF Pipeline Infrastructure Outputs
# =============================================================================

output "docdb_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = aws_docdb_cluster.main.endpoint
}

output "docdb_port" {
  description = "DocumentDB cluster port"
  value       = aws_docdb_cluster.main.port
}

output "s3_bucket_name" {
  description = "S3 bucket name for PDF documents"
  value       = aws_s3_bucket.documents.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.documents.arn
}

output "lambda_function_arn" {
  description = "PDF analyzer Lambda function ARN"
  value       = aws_lambda_function.pdf_analyzer.arn
}

output "lambda_function_name" {
  description = "PDF analyzer Lambda function name"
  value       = aws_lambda_function.pdf_analyzer.function_name
}

output "crawler_lambda_function_arn" {
  description = "Crawler Lambda function ARN"
  value       = aws_lambda_function.crawler.arn
}

output "crawler_lambda_function_name" {
  description = "Crawler Lambda function name"
  value       = aws_lambda_function.crawler.function_name
}

output "crawler_schedule_rule_name" {
  description = "Crawler EventBridge schedule rule name"
  value       = aws_cloudwatch_event_rule.crawler_schedule.name
}

output "nat_gateway_ip" {
  description = "NAT Gateway public IP"
  value       = aws_eip.nat.public_ip
}
