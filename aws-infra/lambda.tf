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

# =============================================================================
# Lambda Function - SH Crawler
# Triggered by EventBridge, crawls SH announcements, uploads PDFs to S3
# =============================================================================

# --- IAM Role ---

resource "aws_iam_role" "crawler_lambda" {
  name = "${var.crawler_lambda_function_name}-lambda-role"

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
    Name = "${var.crawler_lambda_function_name}-lambda-role"
  }
}

# --- IAM Policy: S3 Read/Write ---

resource "aws_iam_role_policy" "crawler_s3" {
  name = "${var.crawler_lambda_function_name}-s3"
  role = aws_iam_role.crawler_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.documents.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.documents.arn}/*"
      }
    ]
  })
}

# --- IAM Policy: CloudWatch Logs ---

resource "aws_iam_role_policy_attachment" "crawler_basic" {
  role       = aws_iam_role.crawler_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --- CloudWatch Log Group ---

resource "aws_cloudwatch_log_group" "crawler" {
  name              = "/aws/lambda/${var.crawler_lambda_function_name}"
  retention_in_days = 14

  tags = {
    Name = "${var.crawler_lambda_function_name}-logs"
  }
}

# --- Lambda Function ---

resource "aws_lambda_function" "crawler" {
  function_name = var.crawler_lambda_function_name
  role          = aws_iam_role.crawler_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  timeout       = var.crawler_lambda_timeout
  memory_size   = var.crawler_lambda_memory_size

  filename         = data.archive_file.lambda_placeholder.output_path
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  environment {
    variables = {
      NODE_ENV             = "production"
      S3_BUCKET_NAME       = aws_s3_bucket.documents.id
      CRAWL_MAX_LIST_PAGES = var.crawler_max_list_pages
    }
  }

  tags = {
    Name = var.crawler_lambda_function_name
  }

  depends_on = [
    aws_iam_role_policy.crawler_s3,
    aws_iam_role_policy_attachment.crawler_basic,
    aws_cloudwatch_log_group.crawler
  ]
}

# --- EventBridge Schedule ---

resource "aws_cloudwatch_event_rule" "crawler_schedule" {
  name                = "${var.crawler_lambda_function_name}-schedule"
  description         = "Run SH crawler Lambda on a schedule"
  schedule_expression = var.crawler_schedule_expression
  state               = "ENABLED"

  tags = {
    Name = "${var.crawler_lambda_function_name}-schedule"
  }
}

resource "aws_cloudwatch_event_target" "crawler" {
  rule      = aws_cloudwatch_event_rule.crawler_schedule.name
  target_id = "crawler-lambda"
  arn       = aws_lambda_function.crawler.arn

  retry_policy {
    maximum_retry_attempts = 2
  }
}

resource "aws_lambda_permission" "crawler_eventbridge" {
  statement_id  = "AllowEventBridgeInvokeCrawler"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.crawler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.crawler_schedule.arn
}
