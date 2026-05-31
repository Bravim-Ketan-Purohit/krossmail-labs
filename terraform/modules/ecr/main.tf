# ECR module: one immutable, scan-on-push, KMS-encrypted repository per Kross service.

variable "service_names" {
  type        = list(string)
  description = "Service names that each get an ECR repository."
}

variable "tags" {
  type    = map(string)
  default = {}
}

resource "aws_ecr_repository" "this" {
  for_each = toset(var.service_names)

  name                 = "kross/${each.value}"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = var.tags
}

output "repository_urls" {
  value = { for name, repo in aws_ecr_repository.this : name => repo.repository_url }
}
