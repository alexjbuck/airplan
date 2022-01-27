# S3 bucket for website.
resource "aws_s3_bucket" "root_bucket" {
  bucket = var.bucket_name
  acl = "public-read"
  policy = templatefile("templates/s3-policy.json", { bucket = var.bucket_name })

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  tags = var.common_tags
}
