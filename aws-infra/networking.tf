# =============================================================================
# Private Subnets, NAT Gateway, Route Tables
# For Lambda and DocumentDB (PDF analysis pipeline)
# =============================================================================

data "aws_availability_zones" "available" {
  state = "available"
}

# --- Private Subnets (2 AZs for DocumentDB subnet group requirement) ---

resource "aws_subnet" "private_a" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.private_subnet_cidr_a
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.name_prefix}-private-a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.private_subnet_cidr_b
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.name_prefix}-private-b"
  }
}

# --- NAT Gateway (Lambda internet access for Bedrock API) ---

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${var.name_prefix}-nat-eip"
  }
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = data.aws_subnets.default.ids[0] # Public subnet

  tags = {
    Name = "${var.name_prefix}-nat-gw"
  }

  depends_on = [aws_eip.nat]
}

# --- Private Route Table ---

resource "aws_route_table" "private" {
  vpc_id = data.aws_vpc.default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "${var.name_prefix}-private-rt"
  }
}

resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private.id
}
