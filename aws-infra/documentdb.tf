# =============================================================================
# DocumentDB (MongoDB-compatible) - Stores Q&A state machines, announcements
# =============================================================================

# --- Security Group ---

resource "aws_security_group" "docdb" {
  name        = "${var.name_prefix}-docdb-sg"
  description = "Security group for DocumentDB cluster"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "MongoDB from EC2 (API server)"
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name_prefix}-docdb-sg"
  }
}

# Separate rule to avoid cycle with lambda SG
resource "aws_security_group_rule" "docdb_from_lambda" {
  type                     = "ingress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  security_group_id        = aws_security_group.docdb.id
  source_security_group_id = aws_security_group.lambda.id
  description              = "MongoDB from Lambda"
}

# --- Subnet Group ---

resource "aws_docdb_subnet_group" "main" {
  name       = "${var.name_prefix}-docdb-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = {
    Name = "${var.name_prefix}-docdb-subnet-group"
  }
}

# --- DocumentDB Cluster ---

resource "aws_docdb_cluster" "main" {
  cluster_identifier = "${var.name_prefix}-docdb"
  engine             = "docdb"
  engine_version     = "5.0.0"

  master_username = var.docdb_master_username
  master_password = var.docdb_master_password

  db_subnet_group_name   = aws_docdb_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.docdb.id]

  port                   = 27017
  storage_encrypted      = true
  backup_retention_period = 7
  preferred_backup_window = "03:00-04:00"

  skip_final_snapshot = true

  tags = {
    Name = "${var.name_prefix}-docdb"
  }
}

# --- DocumentDB Instance ---

resource "aws_docdb_cluster_instance" "main" {
  identifier         = "${var.name_prefix}-docdb-instance-1"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.docdb_instance_class

  tags = {
    Name = "${var.name_prefix}-docdb-instance-1"
  }
}
