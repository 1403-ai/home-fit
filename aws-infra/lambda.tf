# =============================================================================
# Lambda Function - PDF Analyzer
# Triggered by S3, calls Bedrock Claude Opus 4, writes to DocumentDB
# =============================================================================

# --- IAM Role ---

resource "aws_iam_role" "lambda_pdf_analyzer" {
  name = "${var.name_prefix}-lambda-pdf-analyzer-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.name_prefix}-lambda-pdf-analyzer-role"
  }
}

# --- IAM Policy: S3 Read ---

resource "aws_iam_role_policy" "lambda_s3_read" {
  name = "${var.name_prefix}-lambda-s3-read"
  role = aws_iam_role.lambda_pdf_analyzer.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.documents.arn}/*"
      }
    ]
  })
}

# --- IAM Policy: Bedrock InvokeModel ---

resource "aws_iam_role_policy" "lambda_bedrock" {
  name = "${var.name_prefix}-lambda-bedrock"
  role = aws_iam_role.lambda_pdf_analyzer.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = "arn:aws:bedrock:${var.region}::foundation-model/${var.bedrock_model_id}"
      }
    ]
  })
}

# --- IAM Policy: VPC Access (ENI management) ---

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.lambda_pdf_analyzer.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# --- IAM Policy: CloudWatch Logs ---

resource "aws_iam_role_policy" "lambda_logs" {
  name = "${var.name_prefix}-lambda-logs"
  role = aws_iam_role.lambda_pdf_analyzer.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.pdf_analyzer.arn}:*"
      }
    ]
  })
}

# --- Security Group ---

resource "aws_security_group" "lambda" {
  name        = "${var.name_prefix}-lambda-sg"
  description = "Security group for PDF analyzer Lambda"
  vpc_id      = data.aws_vpc.default.id

  egress {
    description = "HTTPS outbound (Bedrock API via NAT)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name_prefix}-lambda-sg"
  }
}

# Separate rule to avoid cycle with docdb SG
resource "aws_security_group_rule" "lambda_to_docdb" {
  type                     = "egress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  security_group_id        = aws_security_group.lambda.id
  source_security_group_id = aws_security_group.docdb.id
  description              = "DocumentDB access"
}

# --- CloudWatch Log Group ---

resource "aws_cloudwatch_log_group" "pdf_analyzer" {
  name              = "/aws/lambda/${var.name_prefix}-pdf-analyzer"
  retention_in_days = 14

  tags = {
    Name = "${var.name_prefix}-pdf-analyzer-logs"
  }
}

# --- Lambda Function ---

data "archive_file" "lambda_placeholder" {
  type        = "zip"
  output_path = "${path.module}/lambda-placeholder.zip"

  source {
    content  = "exports.handler = async (event) => { console.log('Placeholder - deploy actual code'); return { statusCode: 200 }; };"
    filename = "index.js"
  }
}

resource "aws_lambda_function" "pdf_analyzer" {
  function_name = "${var.name_prefix}-pdf-analyzer"
  role          = aws_iam_role.lambda_pdf_analyzer.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  filename         = data.archive_file.lambda_placeholder.output_path
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DOCDB_ENDPOINT  = aws_docdb_cluster.main.endpoint
      DOCDB_PORT      = tostring(aws_docdb_cluster.main.port)
      DOCDB_USERNAME  = var.docdb_master_username
      DOCDB_PASSWORD  = var.docdb_master_password
      DOCDB_DATABASE  = "homefit"
      BEDROCK_MODEL_ID = var.bedrock_model_id
      S3_BUCKET_NAME  = aws_s3_bucket.documents.id
    }
  }

  tags = {
    Name = "${var.name_prefix}-pdf-analyzer"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.pdf_analyzer,
    aws_nat_gateway.main
  ]
}
