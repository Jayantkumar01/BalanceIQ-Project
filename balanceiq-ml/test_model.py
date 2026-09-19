import joblib
import pandas as pd

model = joblib.load(
    "burnout_model.pkl"
)

sample = pd.DataFrame([
    {
        "hoursWorked": 12,
        "mood": 2,
        "focus": 3,
        "meetingHours": 8,
        "tasksCompleted": 2
    }
])

prediction = model.predict(sample)

print(
    "Predicted Burnout Risk:",
    prediction[0]
)