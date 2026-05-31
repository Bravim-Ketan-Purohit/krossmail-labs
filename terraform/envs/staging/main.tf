# Staging environment — composes the Stage 0 baseline: VPC (private subnets),
# ECR repos (one per service), EKS cluster, and the GitHub OIDC role CI assumes.
# Uses the community AWS modules for VPC/EKS (the standard, audited building blocks).

terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "kross-tf-state-us-east-1"
    key            = "envs/staging/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "kross-tf-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Project = "kross"
      Env     = "staging"
    }
  }
}

locals {
  services = [
    "auth-service",
    "sync-service",
    "ai-service",
    "rag-service",
    "calendar-service",
    "file-service",
    "notification-service",
  ]
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "kross-staging"
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

module "ecr" {
  source        = "../../modules/ecr"
  service_names = local.services
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "kross-staging"
  cluster_version = "1.31"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.large"]
      min_size       = 2
      max_size       = 4
      desired_size   = 2
    }
  }
}
