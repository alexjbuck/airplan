# S3 bucket for website.
resource "aws_s3_bucket" "root_bucket" {
  bucket = var.bucket_name
  tags = var.common_tags
}

// Origin Access Identity bucket policy.
resource "aws_s3_bucket_policy" "oai_bucket_policy" {
  bucket = aws_s3_bucket.root_bucket.id
  policy = data.aws_iam_policy_document.root_bucket_policy.json
}

// Website configuration
resource "aws_s3_bucket_website_configuration" "root_bucket_website_configuration" {
  bucket = aws_s3_bucket.root_bucket.bucket
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "root" {
  bucket = aws_s3_bucket.root_bucket.id

  block_public_acls   = true
  block_public_policy = true
  restrict_public_buckets = true
  ignore_public_acls   = true
}