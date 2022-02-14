// Create a user for the cicd pipeline
resource "aws_iam_user" "cicd-user" {
  name = "${var.bucket_name}-cicd-user"
}

// Create a resource for aws_iam_access_key
resource "aws_iam_access_key" "cicd-user-access-key" {
  user = "${aws_iam_user.cicd-user.name}"
}

// Origin Access Identity bucket policy for CloudFront
data "aws_iam_policy_document" "root_bucket_policy" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.root_bucket.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.root_origin_access_identity.iam_arn]  
    }
  }
}

// Policy for CICD user (GitHub aws s3 sync action)
resource "aws_iam_policy" "cicd-user-policy" {
  name        = "cicd-user-policy"
  description = "Full access to ${var.bucket_name} bucket."
  policy      = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket",
                "s3:DeleteObject",
            ],
            "Resource": [
                "arn:aws:s3:::${var.bucket_name}",
                "arn:aws:s3:::${var.bucket_name}/*"
            ]
        },
        {
            "Effect": "Deny",
            "NotAction": "s3:*",
            "NotResource": [
                "arn:aws:s3:::${var.bucket_name}",
                "arn:aws:s3:::${var.bucket_name}/*"
            ]
        }
    ]
})
}

// Write an aws iam user policy attachment for the cicd user
resource "aws_iam_user_policy_attachment" "cicd-user-policy-attachment" {
  user = "${aws_iam_user.cicd-user.name}"
  policy_arn = "${aws_iam_policy.cicd-user-policy.arn}"
}

// Write the access key id output
output "cicd-user-access-key" {
  value = "${aws_iam_access_key.cicd-user-access-key.id}"
  sensitive = true
}

// write the access key secret output
output "cicd-user-access-key-secret" {
  value = "${aws_iam_access_key.cicd-user-access-key.secret}"
  sensitive = true
}