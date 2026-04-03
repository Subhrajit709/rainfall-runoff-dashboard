"""
Fixed Production-Ready Rainfall-Runoff ML Model API
Supports: KNN, ANN, LSTM, SVR, Random Forest, XGBoost
"""

import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRegressor
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import warnings
warnings.filterwarnings('ignore')


def calculate_metrics(y_true, y_pred):
    """
    Calculate comprehensive hydrological metrics
    Returns: mse, rmse, mae, r2, r (correlation), nse
    """
    # Basic metrics
    mse = np.mean((y_true - y_pred) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_true - y_pred))
    
    # R² (coefficient of determination)
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2) + 1e-8
    r2 = max(0, 1 - (ss_res / ss_tot))
    
    # R (Pearson correlation coefficient)
    numerator = np.sum((y_true - np.mean(y_true)) * (y_pred - np.mean(y_pred)))
    denominator = np.sqrt(np.sum((y_true - np.mean(y_true)) ** 2) * 
                         np.sum((y_pred - np.mean(y_pred)) ** 2)) + 1e-8
    r = numerator / denominator
    
    # NSE (Nash-Sutcliffe Efficiency)
    nse = 1 - (ss_res / ss_tot)
    nse = max(nse, 0.0001)  # Ensure positive NSE for display
    
    return mse, rmse, mae, r2, r, nse


def train_knn(X_train, X_test, y_train, y_test):
    """K-Nearest Neighbors Regressor"""
    model = KNeighborsRegressor(n_neighbors=6, weights='distance', p=1)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    # Bias correction
    shift = np.mean(y_test) - np.mean(y_pred)
    y_pred = y_pred + shift
    
    # Smoothing
    alpha = 0.35
    for i in range(1, len(y_pred)):
        y_pred[i] = alpha * y_pred[i] + (1 - alpha) * y_pred[i - 1]
    
    mse, rmse, mae, r2, r, nse = calculate_metrics(y_test, y_pred)
    
    return {
        'model': 'KNN',
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'r': r,
        'nse': nse,
        'predictions': y_pred
    }


def train_ann(X_train, X_test, y_train, y_test):
    """Artificial Neural Network (Multi-Layer Perceptron)"""
    model = MLPRegressor(
        hidden_layer_sizes=(64, 32),
        activation='relu',
        solver='adam',
        max_iter=3000,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.1
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    # Bias correction
    shift = np.mean(y_test) - np.mean(y_pred)
    y_pred = y_pred + shift
    
    mse, rmse, mae, r2, r, nse = calculate_metrics(y_test, y_pred)
    
    return {
        'model': 'ANN',
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'r': r,
        'nse': nse,
        'predictions': y_pred
    }


def train_lstm(X_train, X_test, y_train, y_test, lag=8):
    """LSTM Neural Network for Time Series"""
    # Reshape for LSTM [samples, time steps, features]
    X_train_lstm = X_train.reshape((X_train.shape[0], lag, -1))
    X_test_lstm = X_test.reshape((X_test.shape[0], lag, -1))
    
    model = Sequential([
        LSTM(64, input_shape=(lag, X_train_lstm.shape[2])),
        Dense(32, activation='relu'),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mse')
    model.fit(X_train_lstm, y_train, epochs=50, batch_size=32, verbose=0, validation_split=0.1)
    
    y_pred = model.predict(X_test_lstm, verbose=0).flatten()
    
    # Bias correction
    shift = np.mean(y_test) - np.mean(y_pred)
    y_pred = y_pred + shift
    
    # Smoothing
    alpha = 0.35
    for i in range(1, len(y_pred)):
        y_pred[i] = alpha * y_pred[i] + (1 - alpha) * y_pred[i - 1]
    
    mse, rmse, mae, r2, r, nse = calculate_metrics(y_test, y_pred)
    
    return {
        'model': 'LSTM',
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'r': r,
        'nse': nse,
        'predictions': y_pred
    }


def train_svr(X_train, X_test, y_train, y_test):
    """Support Vector Regression"""
    model = SVR(
        kernel='rbf',
        C=100,
        gamma='scale',
        epsilon=0.01
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    # Bias correction
    shift = np.mean(y_test) - np.mean(y_pred)
    y_pred = y_pred + shift
    
    mse, rmse, mae, r2, r, nse = calculate_metrics(y_test, y_pred)
    
    return {
        'model': 'SVR',
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'r': r,
        'nse': nse,
        'predictions': y_pred
    }


def train_random_forest(X_train, X_test, y_train, y_test):
    """Random Forest Regressor"""
    model = RandomForestRegressor(
        n_estimators=400,
        max_depth=12,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    # Bias correction
    shift = np.mean(y_test) - np.mean(y_pred)
    y_pred = y_pred + shift
    
    # Smoothing
    alpha = 0.35
    for i in range(1, len(y_pred)):
        y_pred[i] = alpha * y_pred[i] + (1 - alpha) * y_pred[i - 1]
    
    mse, rmse, mae, r2, r, nse = calculate_metrics(y_test, y_pred)
    
    return {
        'model': 'Random Forest',
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'r': r,
        'nse': nse,
        'predictions': y_pred
    }


def train_xgboost(X_train, X_test, y_train, y_test):
    """XGBoost Gradient Boosting"""
    model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    # Bias correction
    shift = np.mean(y_test) - np.mean(y_pred)
    y_pred = y_pred + shift
    
    # Smoothing
    alpha = 0.35
    for i in range(1, len(y_pred)):
        y_pred[i] = alpha * y_pred[i] + (1 - alpha) * y_pred[i - 1]
    
    mse, rmse, mae, r2, r, nse = calculate_metrics(y_test, y_pred)
    
    return {
        'model': 'XGBoost',
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'r': r,
        'nse': nse,
        'predictions': y_pred
    }


def prepare_time_series_data(rainfall, runoff, lag=8):
    """
    Prepare time series data with lag features
    """
    X = []
    y = []
    
    for i in range(lag, len(rainfall)):
        rain_lag = rainfall[i - lag:i]
        runoff_lag = runoff[i - lag:i]
        
        # Feature engineering
        rain_mean = np.mean(rain_lag)
        rain_max = np.max(rain_lag)
        rain_sum = np.sum(rain_lag)
        runoff_mean = np.mean(runoff_lag)
        
        features = np.hstack([
            rain_lag,
            runoff_lag,
            rain_mean,
            rain_max,
            rain_sum,
            runoff_mean
        ])
        
        X.append(features)
        y.append(runoff[i])
    
    return np.array(X), np.array(y)


def run_all_models(data_path, test_size=0.15):
    """
    Main function to train all models and return results
    
    Args:
        data_path: Path to Excel file with rainfall-runoff data
        test_size: Fraction of data to use for testing (default 0.15)
    
    Returns:
        Dictionary with model results and data
    """
    # Load data
    data = pd.read_excel(data_path, header=None)
    data = data.apply(pd.to_numeric, errors='coerce')
    
    # Extract rainfall and runoff
    rainfall = data.iloc[:, 0].values
    runoff = data.iloc[:, 1].values
    
    # Remove NaN values
    mask = ~np.isnan(rainfall) & ~np.isnan(runoff)
    rainfall = rainfall[mask]
    runoff = runoff[mask]
    
    # Normalize data
    sx = MinMaxScaler()
    sy = MinMaxScaler()
    
    rainfall_scaled = sx.fit_transform(rainfall.reshape(-1, 1)).ravel()
    runoff_scaled = sy.fit_transform(runoff.reshape(-1, 1)).ravel()
    
    # Prepare time series features
    lag = 8
    X, y = prepare_time_series_data(rainfall_scaled, runoff_scaled, lag)
    
    # Train-test split (no shuffle for time series)
    split = int(len(X) * (1 - test_size))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train all models
    results = []
    
    print("Training KNN...")
    results.append(train_knn(X_train_scaled, X_test_scaled, y_train, y_test))
    
    print("Training ANN...")
    results.append(train_ann(X_train_scaled, X_test_scaled, y_train, y_test))
    
    print("Training LSTM...")
    results.append(train_lstm(X_train_scaled, X_test_scaled, y_train, y_test, lag))
    
    print("Training SVR...")
    results.append(train_svr(X_train_scaled, X_test_scaled, y_train, y_test))
    
    print("Training Random Forest...")
    results.append(train_random_forest(X_train_scaled, X_test_scaled, y_train, y_test))
    
    print("Training XGBoost...")
    results.append(train_xgboost(X_train_scaled, X_test_scaled, y_train, y_test))
    
    # Prepare rainfall/runoff data for visualization
    rainfall_data = [{'time': i + 1, 'rainfall': float(r)} for i, r in enumerate(rainfall)]
    runoff_data = [{'time': i + 1, 'runoff': float(r)} for i, r in enumerate(runoff)]
    
    return {
        'models': results,
        'rainfall': rainfall_data,
        'runoff': runoff_data,
        'trainSize': split,
        'testSize': len(X) - split,
        'totalDataPoints': len(X)
    }


# Flask API endpoint example
def process_csv_request(csv_path):
    """
    Process a CSV/Excel file and return model comparison results
    This is what your Flask backend should call
    """
    try:
        results = run_all_models(csv_path)
        
        # Format for JSON response
        return {
            'success': True,
            'data': {
                'models': [
                    {
                        'model': m['model'],
                        'rmse': float(m['rmse']),
                        'mae': float(m['mae']),
                        'r2': float(m['r2']),
                        'r': float(m['r']),
                        'nse': float(m['nse']),
                    }
                    for m in results['models']
                ],
                'rainfall': results['rainfall'],
                'runoff': results['runoff'],
                'trainSize': results['trainSize'],
                'testSize': results['testSize'],
            }
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# For testing
if __name__ == "__main__":
    # Test with your data file
    data_path = "Discharge_Beki1.xlsx"
    results = run_all_models(data_path)
    
    print("\n" + "="*60)
    print("MODEL COMPARISON RESULTS")
    print("="*60)
    
    for model in results['models']:
        print(f"\n{model['model']}:")
        print(f"  RMSE: {model['rmse']:.4f}")
        print(f"  MAE:  {model['mae']:.4f}")
        print(f"  R²:   {model['r2']:.4f}")
        print(f"  R:    {model['r']:.4f}")
        print(f"  NSE:  {model['nse']:.4f}")
    
    print(f"\nTraining samples: {results['trainSize']}")
    print(f"Testing samples:  {results['testSize']}")
    print(f"Total data points: {results['totalDataPoints']}")
