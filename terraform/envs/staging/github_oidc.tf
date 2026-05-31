# GitHub Actions OIDC — lets CI assume a short-lived role with no long-lived AWS
# secrets stored in GitHub. Scope the trust to this repo; attach least-privilege
# policies (ECR push, EKS deploy) as those needs land in later stages.

variable "github_repo" {
  type        = string
  description = "owner/repo allowed to assume the CI role."
  default     = "your-org/kross"
}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "github_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "github_ci" {
  name               = "kross-staging-github-ci"
  assume_role_policy = data.aws_iam_policy_document.github_assume.json
}
