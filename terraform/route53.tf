// Hosted zone for subdomain
#resource "aws_route53_zone" "main" {
#  name = var.domain_name
#  tags = var.common_tags
#}

// Parent hosted zone
data "aws_route53_zone" "parent" {
  name = var.parent_domain_name
}

// CNAME record for subdomain.parent pointing to subdomain A record
#resource "aws_route53_record" "parent_subdomain" {
#  zone_id = data.aws_route53_zone.parent.zone_id
#  name = var.domain_name
#  type = "CNAME"
#  
#  alias {
#    name    = aws_route53_record.root-a.name
#    zone_id = aws_route53_record.root-a.zone_id
#    evaluate_target_health = false
#  }
#}

// CNAME record for www.subdomain.parent pointing to subdomain www-A record
#resource "aws_route53_record" "parent_www_subdomain" {
#  zone_id = data.aws_route53_zone.parent.zone_id
#  name = "www.${var.domain_name}"
#  type = "CNAME"
#  
#  alias {
#    name    = aws_route53_record.www-a.name
#    zone_id = aws_route53_record.www-a.zone_id
#    evaluate_target_health = false
#  }
#}

// Subdomain A record
resource "aws_route53_record" "root-a" {
  zone_id = data.aws_route53_zone.parent.zone_id
  name = var.domain_name
  type = "A"

  alias {
    name = aws_cloudfront_distribution.root_s3_distribution.domain_name
    zone_id = aws_cloudfront_distribution.root_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

// Subdomain www-A record
resource "aws_route53_record" "www-a" {
  zone_id = data.aws_route53_zone.parent.zone_id
  name = "www.${var.domain_name}"
  type = "A"

  alias {
    name = aws_cloudfront_distribution.root_s3_distribution.domain_name
    zone_id = aws_cloudfront_distribution.root_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

// Subdomain AAAA record for HTTPS redirects
resource "aws_route53_record" "root-aaaa" {
  zone_id = data.aws_route53_zone.parent.zone_id
  name = var.domain_name
  type = "AAAA"

  alias {
    name = aws_cloudfront_distribution.root_s3_distribution.domain_name
    zone_id = aws_cloudfront_distribution.root_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

// Subdomain www-AAAA record for HTTPS redirects
resource "aws_route53_record" "www-aaaa" {
  zone_id = data.aws_route53_zone.parent.zone_id
  name = "www.${var.domain_name}"
  type = "AAAA"

  alias {
    name = aws_cloudfront_distribution.root_s3_distribution.domain_name
    zone_id = aws_cloudfront_distribution.root_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

#resource "aws_route53_record" "cert_validation" {
#  for_each = {
#    for dvo in aws_acm_certificate.ssl_certificate.domain_validation_options : dvo.domain_name => {
#      name   = dvo.resource_record_name
#      record = dvo.resource_record_value
#      type   = dvo.resource_record_type
#    }
#  }
#
#  allow_overwrite = true
#  name            = each.value.name
#  records         = [each.value.record]
#  ttl             = 60
#  type            = each.value.type
#  zone_id         = data.aws_route53_zone.parent.zone_id
#}
