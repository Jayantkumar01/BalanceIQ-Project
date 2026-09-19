import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load Dataset
df = pd.read_csv(
    "burnout_dataset.csv"
)

# Features
X = df[
    [
        "hoursWorked",
        "mood",
        "focus",
        "meetingHours",
        "tasksCompleted"
    ]
]

# Target
y = df["burnoutRisk"]

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train
model.fit(
    X_train,
    y_train
)

# Predict
predictions = model.predict(
    X_test
)

# Accuracy
accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n========== MODEL RESULTS ==========\n")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions
    )
)

# Save Model
joblib.dump(
    model,
    "burnout_model.pkl"
)

print(
    "\nModel Saved Successfully"
)