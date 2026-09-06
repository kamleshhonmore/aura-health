# %% [markdown]
# # Aura Health - Predictive ML Models (Google Colab Script)
# This script is designed to be run in Google Colab. 
# It generates a synthetic dataset based on our discussed metrics (wearables, screen time, cycle data)
# and trains lightweight XGBoost models to predict PCOS, PMDD, Insulin Resistance, and Thyroid issues.

# %%
# 1. Install required libraries (Run this cell in Colab)
# !pip install pandas numpy scikit-learn xgboost

# %%
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

print("Libraries imported successfully!")

# %% [markdown]
# ## Step 1: Generate Synthetic Medical Data
# Since we don't have real patient data yet, we will simulate a dataset of 5,000 users.
# We will create correlations (e.g., high screen time + luteal phase = higher PMDD risk).

# %%
np.random.seed(42)
num_samples = 5000

# Generate Base Features
data = {
    'age': np.random.randint(16, 45, num_samples),
    'bmi': np.random.normal(24, 5, num_samples),
    'cycle_length_days': np.random.normal(28, 7, num_samples), # Normal is ~28, PCOS can be 35+
    'period_duration_days': np.random.normal(5, 1.5, num_samples),
    'sleep_duration_hours': np.random.normal(6.5, 1.5, num_samples), # Wearable data
    'resting_heart_rate': np.random.normal(70, 10, num_samples), # Wearable data
    'late_night_screen_time_mins': np.random.exponential(30, num_samples), # Phone activity
    
    # Symptoms (0 to 10 scale)
    'acne_severity': np.random.randint(0, 11, num_samples),
    'hair_growth_severity': np.random.randint(0, 11, num_samples), # Hirsutism
    'mood_swings_severity': np.random.randint(0, 11, num_samples),
    'sugar_craving_severity': np.random.randint(0, 11, num_samples),
    'fatigue_severity': np.random.randint(0, 11, num_samples)
}

df = pd.DataFrame(data)

# Inject Medical Logic to create Target Labels (0 = Low Risk, 1 = High Risk)
# PCOS: Long cycles, high BMI, acne, hair growth
df['risk_pcos'] = ((df['cycle_length_days'] > 35) & (df['acne_severity'] > 6) & (df['hair_growth_severity'] > 5)).astype(int)

# Insulin Resistance: High BMI, high sugar cravings, high fatigue
df['risk_insulin_resistance'] = ((df['bmi'] > 28) & (df['sugar_craving_severity'] > 7) & (df['fatigue_severity'] > 6)).astype(int)
# Increase IR risk if they have PCOS (Comorbidity)
df.loc[df['risk_pcos'] == 1, 'risk_insulin_resistance'] = np.where(np.random.rand(sum(df['risk_pcos'] == 1)) > 0.3, 1, df.loc[df['risk_pcos'] == 1, 'risk_insulin_resistance'])

# PMDD: High mood swings, high late-night screen time, low sleep
df['risk_pmdd'] = ((df['mood_swings_severity'] > 8) & (df['late_night_screen_time_mins'] > 60) & (df['sleep_duration_hours'] < 6)).astype(int)

# Thyroid: High fatigue, long cycles, high resting HR (or very low), but no acne/hair (differentiates from PCOS)
df['risk_thyroid'] = ((df['fatigue_severity'] > 8) & (df['resting_heart_rate'] < 60) & (df['acne_severity'] < 4)).astype(int)

print(f"Dataset generated with {num_samples} records.")
print("\nDisease Prevalence in synthetic data:")
print(df[['risk_pcos', 'risk_insulin_resistance', 'risk_pmdd', 'risk_thyroid']].mean() * 100)

# %% [markdown]
# ## Step 2: Prepare Data for Training
# We will train separate XGBoost classifiers for each condition to maintain our "Modular Architecture".

# %%
features = [col for col in df.columns if not col.startswith('risk_')]
X = df[features]

# We will create a dictionary to hold our trained models
models = {}
targets = ['risk_pcos', 'risk_insulin_resistance', 'risk_pmdd', 'risk_thyroid']

# Split data (80% train, 20% test)
X_train, X_test, y_train_all, y_test_all = train_test_split(X, df[targets], test_size=0.2, random_state=42)

# %% [markdown]
# ## Step 3: Train the Models (XGBoost)

# %%
for target in targets:
    print(f"--- Training Model for {target.upper()} ---")
    y_train = y_train_all[target]
    y_test = y_test_all[target]
    
    # Initialize XGBoost Classifier
    # scale_pos_weight helps deal with imbalanced datasets (few sick people, many healthy)
    model = xgb.XGBClassifier(
        n_estimators=100, 
        max_depth=4, 
        learning_rate=0.1, 
        random_state=42,
        eval_metric='logloss'
    )
    
    # Train the model
    model.fit(X_train, y_train)
    models[target] = model
    
    # Predict on test set
    y_pred = model.predict(X_test)
    
    # Evaluate
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    print("\n")

# %% [markdown]
# ## Step 4: Test with a Mock User
# Let's see what the models predict for a user with specific symptoms.

# %%
# Mock User: 28 years old, long cycles, high screen time, low sleep, mood swings.
mock_user_data = {
    'age': [28],
    'bmi': [23.5],
    'cycle_length_days': [38],
    'period_duration_days': [6],
    'sleep_duration_hours': [4.5], # Poor sleep
    'resting_heart_rate': [75],
    'late_night_screen_time_mins': [120], # High screen time
    'acne_severity': [7],
    'hair_growth_severity': [6],
    'mood_swings_severity': [9], # High mood swings
    'sugar_craving_severity': [5],
    'fatigue_severity': [7]
}

mock_df = pd.DataFrame(mock_user_data)

print("--- DIAGNOSTIC RESULTS FOR MOCK USER ---")
for target, model in models.items():
    # Predict probability
    prob = model.predict_proba(mock_df)[0][1] * 100
    prediction = "HIGH RISK" if prob > 50 else "LOW RISK"
    print(f"{target.replace('risk_', '').upper()}: {prediction} ({prob:.1f}% confidence)")

# %% [markdown]
# ## Step 5: Exporting the Model (For Android Integration Later)
# Once you are happy with the model, you can export it to be used directly in the Android app.

# %%
# Uncomment below to save the PCOS model as a JSON file, which can be loaded in Android/Java via XGBoost-Predictor
# models['risk_pcos'].save_model('pcos_model.json')
# print("Model saved as pcos_model.json!")
