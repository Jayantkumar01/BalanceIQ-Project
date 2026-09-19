import pandas as pd
import random

data = []

for _ in range(1000):

    hours_worked = random.randint(4, 12)
    mood = random.randint(1, 10)
    focus = random.randint(1, 10)
    meeting_hours = random.randint(0, 8)
    tasks_completed = random.randint(0, 15)

    score = 0
    score += hours_worked * 4
    score += meeting_hours * 3
    score += (10 - mood) * 5
    score += (10 - focus) * 5

    if score >= 70:
        risk = "HIGH"
    elif score >= 40:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    data.append([
        hours_worked,
        mood,
        focus,
        meeting_hours,
        tasks_completed,
        risk
    ])

df = pd.DataFrame(
    data,
    columns=[
        "hoursWorked",
        "mood",
        "focus",
        "meetingHours",
        "tasksCompleted",
        "burnoutRisk"
    ]
)

df.to_csv(
    "burnout_dataset.csv",
    index=False
)

print("Dataset Generated Successfully")