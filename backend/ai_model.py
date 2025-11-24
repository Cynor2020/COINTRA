import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import json
import os
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class CryptoPricePredictor:
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler()
        self.lookback_window = 60  # Use 60 days of historical data
        
    def create_dataset(self, data, lookback=60):
        """Create dataset for time series prediction"""
        X, y = [], []
        for i in range(lookback, len(data)):
            X.append(data[i-lookback:i, 0])
            y.append(data[i, 0])
        return np.array(X), np.array(y)
    
    def prepare_features(self, data):
        """Prepare features for prediction"""
        # Convert to numpy array if it's a pandas series
        if isinstance(data, pd.Series):
            data = data.values.reshape(-1, 1)
        elif isinstance(data, list):
            data = np.array(data).reshape(-1, 1)
        else:
            data = data.reshape(-1, 1)
            
        # Scale the data
        scaled_data = self.scaler.fit_transform(data)
        return scaled_data
    
    def train(self, historical_data):
        """Train the model with historical data"""
        # Prepare features
        scaled_data = self.prepare_features(historical_data)
        
        # Create dataset
        X, y = self.create_dataset(scaled_data, self.lookback_window)
        
        # Split data (80% train, 20% test)
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        # Inverse transform predictions
        train_pred_scaled = self.scaler.inverse_transform(train_pred.reshape(-1, 1))
        test_pred_scaled = self.scaler.inverse_transform(test_pred.reshape(-1, 1))
        y_train_scaled = self.scaler.inverse_transform(y_train.reshape(-1, 1))
        y_test_scaled = self.scaler.inverse_transform(y_test.reshape(-1, 1))
        
        # Calculate metrics
        train_rmse = np.sqrt(mean_squared_error(y_train_scaled, train_pred_scaled))
        test_rmse = np.sqrt(mean_squared_error(y_test_scaled, test_pred_scaled))
        train_mae = mean_absolute_error(y_train_scaled, train_pred_scaled)
        test_mae = mean_absolute_error(y_test_scaled, test_pred_scaled)
        
        print(f"Training RMSE: {train_rmse:.4f}")
        print(f"Testing RMSE: {test_rmse:.4f}")
        print(f"Training MAE: {train_mae:.4f}")
        print(f"Testing MAE: {test_mae:.4f}")
        
        return {
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'train_mae': train_mae,
            'test_mae': test_mae
        }
    
    def predict(self, recent_data, days_ahead=1):
        """Predict future prices"""
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
            
        # Prepare recent data
        recent_scaled = self.scaler.transform(np.array(recent_data[-self.lookback_window:]).reshape(-1, 1))
        X_pred = recent_scaled.reshape(1, -1)
        
        # Make prediction
        pred_scaled = self.model.predict(X_pred)
        pred_price = self.scaler.inverse_transform(pred_scaled.reshape(-1, 1))[0][0]
        
        return pred_price
    
    def predict_multiple_days(self, recent_data, days=7):
        """Predict prices for multiple days ahead"""
        predictions = []
        current_data = list(recent_data)
        
        for i in range(days):
            pred = self.predict(current_data)
            predictions.append(pred)
            current_data.append(pred)  # Add prediction to data for next prediction
            
        return predictions
    
    def save_model(self, filepath):
        """Save the trained model"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'lookback_window': self.lookback_window
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a trained model"""
        if os.path.exists(filepath):
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.lookback_window = model_data['lookback_window']
            print(f"Model loaded from {filepath}")
        else:
            print(f"Model file {filepath} not found")

def generate_sample_data():
    """Generate sample cryptocurrency data for testing"""
    # Generate 365 days of sample data
    dates = pd.date_range(start='2023-01-01', periods=365, freq='D')
    
    # Simulate realistic cryptocurrency price movements
    np.random.seed(42)
    base_price = 30000  # Starting price ~$30,000
    prices = [base_price]
    
    for i in range(1, 365):
        # Random walk with trend and volatility
        trend = 0.0002  # Small upward trend
        volatility = 0.03  # 3% daily volatility
        noise = np.random.normal(0, volatility)
        change = trend + noise
        new_price = prices[-1] * (1 + change)
        # Ensure price doesn't go negative
        new_price = max(new_price, 1000)
        prices.append(new_price)
    
    return pd.DataFrame({
        'date': dates,
        'price': prices
    })

def main():
    """Main function to train and test the model"""
    print("Training AI model for cryptocurrency price prediction...")
    
    # Generate sample data
    print("Generating sample data...")
    df = generate_sample_data()
    
    # Initialize predictor
    predictor = CryptoPricePredictor()
    
    # Train model
    print("Training model...")
    metrics = predictor.train(df['price'].values)
    
    # Make predictions
    print("\nMaking predictions...")
    recent_prices = df['price'].tail(60).values.tolist()
    
    # Predict next day
    next_day_pred = predictor.predict(recent_prices)
    current_price = df['price'].iloc[-1]
    
    print(f"\nCurrent price: ${current_price:.2f}")
    print(f"Predicted next day price: ${next_day_pred:.2f}")
    print(f"Predicted change: {((next_day_pred - current_price) / current_price) * 100:.2f}%")
    
    # Predict next 7 days
    print("\nPredicting next 7 days:")
    week_predictions = predictor.predict_multiple_days(recent_prices, 7)
    for i, pred in enumerate(week_predictions, 1):
        print(f"Day {i}: ${pred:.2f}")
    
    # Save model
    print("\nSaving model...")
    predictor.save_model('crypto_price_model.pkl')
    
    print("\nModel training and testing completed!")

if __name__ == "__main__":
    main()