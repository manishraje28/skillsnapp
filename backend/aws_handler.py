import json
import os
import boto3
import uuid
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
S3_BUCKET = os.getenv("S3_BUCKET_NAME", "skillsnapp")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "ResumeRecommendations")
# Create S3 client using credentials from .env
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

def upload_fileobj_to_s3(fileobj, filename, bucket=S3_BUCKET):
    """Upload file-like object to S3 with safe key"""
    import re

    # Create unique and safe filename
    unique_suffix = str(uuid.uuid4())[:8]
    key = f"{unique_suffix}_{filename}"
    # Replace unsafe characters
    key = re.sub(r"[^\w\-\.]", "_", key)

    fileobj.seek(0)
    extra_args = {"ACL": "private", "ServerSideEncryption": "AES256"}

    try:
        s3_client.upload_fileobj(fileobj, bucket, key, ExtraArgs=extra_args)
    except Exception as e:
        raise RuntimeError(f"Failed to upload to S3: {e}")

    url = f"https://{bucket}.s3.{AWS_REGION}.amazonaws.com/{key}"
    return {"key": key, "url": url}

def generate_presigned_url(key, bucket=S3_BUCKET, expires_in=3600):
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=expires_in
        )
        return url
    except Exception as e:
        raise RuntimeError(f"Failed to generate presigned URL: {e}")

def extract_text_from_s3_file(key, bucket=S3_BUCKET):
    """Textract extraction with debug info"""
    textract_client = boto3.client("textract", region_name=AWS_REGION)

    print("Textract Debug Info:")
    print("Bucket:", bucket)
    print("Key:", key)

    # Check S3 object exists
    try:
        head = s3_client.head_object(Bucket=bucket, Key=key)
        print("✅ Object exists, size:", head["ContentLength"], "type:", head["ContentType"])
    except Exception as e:
        print("❌ Cannot access S3 object:", e)
        raise RuntimeError(f"Cannot access S3 object: {e}")

    # Call Textract
    try:
        response = textract_client.analyze_document(
            Document={"S3Object": {"Bucket": bucket, "Name": key}},
            FeatureTypes=["TABLES", "FORMS"]
        )
    except Exception as e:
        print("❌ Textract error:", e)
        raise

    text = ""
    for block in response.get("Blocks", []):
        if block["BlockType"] == "LINE":
            text += block["Text"] + "\n"

    print("✅ Text extracted successfully")
    return text


def save_recommendation_to_dynamodb(s3_key, user_name, recommendations):
    """
    Save minimal info to DynamoDB for testing
    """
    table.put_item(Item={
        "S3Key": s3_key,
        "UserName": user_name,
        "UploadTime": datetime.utcnow().isoformat(),
        "Recommendations": json.dumps(recommendations)  # store as JSON string
    })
    print("✅ Saved recommendation to DynamoDB")
