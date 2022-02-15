# Cloudfront distribution for main s3 site.
resource "aws_cloudfront_distribution" "root_s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.root_bucket.bucket_regional_domain_name
    origin_id = "S3-${var.bucket_name}"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.root_origin_access_identity.cloudfront_access_identity_path
    }
    #custom_origin_config {
    #  http_port = 80
    #  https_port = 443
    #  origin_protocol_policy = "match-viewer"
    #  origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    #}
  }
  
  
  enabled = true
  is_ipv6_enabled = true
  wait_for_deployment = true
  default_root_object = "index.html"
  price_class = "PriceClass_All"

  aliases = [var.domain_name, "www.${var.domain_name}"]
  
  custom_error_response {
    error_caching_min_ttl = 0
    error_code = 404
    response_code = 200
    response_page_path = "/404.html"
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
      headers = ["Origin"]
    }
    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 60
    max_ttl = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }

  comment = "S3-${var.bucket_name}"
  tags = var.common_tags
}

resource "aws_cloudfront_origin_access_identity" "root_origin_access_identity" {
  comment = "Cloudfront OAI for ${var.bucket_name}"  
}

output "endpoint"{
  value = aws_s3_bucket.root_bucket.website_endpoint
}