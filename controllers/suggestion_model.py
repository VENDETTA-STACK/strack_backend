# -*- coding: utf-8 -*-
"""Suggestion_Model.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1ZC1UOkCUQgTzHZFBZrzLD0rSs3Gp3ld2
"""

# !pip3 install sklearn

import sys
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
import joblib

# from google.colab import drive

# drive.mount('/content/drive')
csv_file_path = sys.argv[1]

# Load and preprocess your expense data
data = pd.read_csv(csv_file_path)

input_data_json = sys.argv[2]

if input_data_json.startswith("\"") and input_data_json.endswith("\""):
    input_data_json = input_data_json[1:-1]

# Load JSON input data
input_data = json.loads(input_data_json)

# data

# Option 2: Label Encoding (for ordinal categorical data)
label_encoder = LabelEncoder()
data['Category'] = label_encoder.fit_transform(data['Category'])

# data['Category'] = data['Category'].astype('category')
# data['Category'] = data['Category'].cat.codes

# Example 2: Scaling numerical features
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()

data['Cost'] = data['Cost'].apply(lambda x: float(x) if str(x).strip().replace('.', '', 1).isdigit() else np.nan)
data['Cost'].fillna(0, inplace=True)  # Replace non-numeric values with 0 or any other suitable value.

joblib.dump(label_encoder, "label_encoder.joblib")

# Feature engineering
data['date'] = pd.to_datetime(data['Date'])
data['Month'] = data['date'].dt.month
data['year'] = data['date'].dt.year
data['DayOfWeek'] = data['date'].dt.day

# data.dtypes

features = data[['Category', 'Cost', 'Month', 'DayOfWeek']]
labels = data['Cost']

# Assuming you have a threshold value for categorizing expenses
threshold = 1000  # Adjust this value as needed

# Convert continuous labels into categorical classes
labels = ['Exceeded' if amount > threshold else 'Within Threshold' for amount in labels]

X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Choose and train a classification model (Decision Tree in this example)
model = DecisionTreeClassifier()

# Choose and train a classification model (Decision Tree in this example)
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Evaluate the model (you should use appropriate metrics for your use case)
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy}")

# Make predictions on new data
# Prepare new monthly expense data for inference

# Replace the following example data with your own data
# new_data = pd.DataFrame({
#     'Category': ['Movie', 'Groceries', 'Entertainment'],
#     'Cost': [1200, 300, 150],
#     'Month': [5,4,3],
#     'DayOfWeek': [10,11,11]
# })

new_data = pd.DataFrame.from_dict(input_data)

new_data['Category'] = label_encoder.fit_transform(new_data['Category'])

# Predict whether expenses exceed thresholds
predictions = model.predict(new_data)

print(predictions)

# Provide suggestions based on predictions
for i, category in enumerate(new_data.Category):
    if predictions[i] == 'Exceeded':
        print(f"Expense for '{label_encoder.inverse_transform([category])}' exceeded the threshold. Consider controlling your expenses in this category for the next month.")
    else:
        print(f"Expense for '{label_encoder.inverse_transform([category])}' is within the acceptable range.")

