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
