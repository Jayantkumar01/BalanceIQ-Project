from flask import Flask, request, jsonify
import pandas as pd
import joblib
import requests
import os

app = Flask(__name__)

# =========================
# LOAD ML MODEL
# =========================

model = joblib.load(
    "burnout_model.pkl"
)

# =========================
# OPENROUTER CONFIG
# =========================

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_MODEL = "deepseek/deepseek-chat-v3"

# =========================
# HOME
# =========================

@app.route("/")
def home():

    return jsonify({
        "message": "BalanceIQ ML API Running",
        "status": "SUCCESS"
    })


# =========================
# BURNOUT PREDICTION
# =========================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    data = request.json

    print(
        "PREDICT REQUEST:",
        data
    )

    sample = pd.DataFrame([
        {
            "hoursWorked":
                data["hoursWorked"],

            "mood":
                data["mood"],

            "focus":
                data["focus"],

            "meetingHours":
                data["meetingHours"],

            "tasksCompleted":
                data["tasksCompleted"]
        }
    ])

    prediction = model.predict(
        sample
    )[0]

    return jsonify({
        "risk": prediction
    })


# =========================
# AI RECOMMENDATIONS
# =========================

@app.route(
    "/recommend",
    methods=["POST"]
)
def recommend():

    try:

        data = request.json

        print(
            "RECOMMEND REQUEST:",
            data
        )

        prompt = f"""
You are an employee wellness coach.

Employee Details:
Risk Level: {data['risk']}
Mood: {data['mood']}/10
Focus: {data['focus']}/10
Meeting Hours: {data['meetingHours']}
Tasks Completed: {data['tasksCompleted']}
Hours Worked: {data['hoursWorked']}

Give exactly 3 wellness recommendations.

Rules:
- Plain text only
- No markdown
- No **
- No numbering
- Each recommendation on a new line starting with "-"
- Maximum 15 words per recommendation
"""


        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization":
                    f"Bearer {OPENROUTER_API_KEY}",

                "Content-Type":
                    "application/json"
            },
            json={
                "model":
                    OPENROUTER_MODEL,

                "messages": [
                    {
                        "role":
                            "user",

                        "content":
                            prompt
                    }
                ]
            },
            timeout=30
        )

        print(
            "STATUS =",
            response.status_code
        )

        print(
            "BODY =",
            response.text
        )

        if response.status_code != 200:

            return jsonify({
                "recommendation":
                    "Unable to generate recommendation."
            })

        result = response.json()

        recommendation = (
            result["choices"][0]
                  ["message"]
                  ["content"]
        )

        return jsonify({
            "recommendation":
                recommendation
        })

    except Exception as e:

        print(
            "RECOMMEND ERROR:",
            str(e)
        )

        return jsonify({
            "recommendation":
                "Unable to generate recommendation."
        })


# =========================
# START SERVER
# =========================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )