from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from aws_handler import upload_fileobj_to_s3, generate_presigned_url, extract_text_from_s3_file, save_recommendation_to_dynamodb
from ai_recommendation import generate_recommendations

app = Flask(__name__)
CORS(app)  # allows frontend (React) to talk to backend

@app.route("/upload", methods=["POST"])
def upload_resume():
    try:
        user_name = request.form.get("user_name")
        file = request.files["file"]

        if not user_name or not file:
            return jsonify({"error": "Missing name or file"}), 400

        original_filename = file.filename
        timestamp = int(time.time())
        filename = f"{user_name}_{timestamp}_{original_filename}"

        # Upload to S3
        result = upload_fileobj_to_s3(file, filename)
        presigned_url = generate_presigned_url(result["key"])

        # Textract
        resume_text = extract_text_from_s3_file(result["key"])

        # AI Recommendations
        ai_output = generate_recommendations(resume_text)

        # Save to DynamoDB
        save_recommendation_to_dynamodb(
            s3_key=result["key"],
            user_name=user_name,
            recommendations=ai_output
        )

        return jsonify({
            "message": "File uploaded and processed successfully",
            "s3_key": result["key"],
            "presigned_url": presigned_url,
            "resume_text": resume_text,
            "recommendations": ai_output
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
