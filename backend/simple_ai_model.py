import json
import random
from datetime import datetime, timedelta

def generate_mock_predictions(coin_id, days=7):
    """Generate mock AI predictions for a cryptocurrency"""
    
    # Base prices for different coins
    base_prices = {
        'bitcoin': 43250,
        'ethereum': 2650,
        'binancecoin': 315,
        'solana': 98,
        'ripple': 0.62,
        'cardano': 0.45,
        'dogecoin': 0.08,
        'polkadot': 7.2,
        'litecoin': 72,
        'chainlink': 18.5
    }
    
    # Get base price or default to $100
    base_price = base_prices.get(coin_id, 100)
    current_price = base_price
    
    # Generate predictions
    predictions = []
    for i in range(1, days + 1):
        # Random fluctuation between -5% and +5%
        change_percent = (random.random() - 0.5) * 0.1
        predicted_price = current_price * (1 + change_percent)
        
        predictions.append({
            'date': (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'),
            'price': round(predicted_price, 2),
            'change_percent': round(change_percent * 100, 2)
        })
        
        # Update current price for next iteration
        current_price = predicted_price
    
    # Calculate overall trend (bullish/bearish)
    price_change = predictions[-1]['price'] - base_price
    trend = 'bullish' if price_change > 0 else 'bearish'
    
    return {
        'coin_id': coin_id,
        'current_price': base_price,
        'predictions': predictions,
        'trend': trend,
        'confidence': round(0.75 + random.random() * 0.2, 2),  # 75-95% confidence
        'risk_level': random.choice(['Low', 'Medium', 'High'])
    }

def save_model():
    """Save a simple mock model"""
    # In a real implementation, we would train and save an actual model
    # For now, we'll just create a marker file
    with open('simple_ai_model.json', 'w') as f:
        json.dump({'model_type': 'mock', 'version': '1.0'}, f)
    print("Simple AI model saved successfully")

if __name__ == "__main__":
    # Test the mock prediction function
    print("Testing AI model with mock predictions...")
    
    # Test with Bitcoin
    btc_predictions = generate_mock_predictions('bitcoin', 7)
    print("\nBitcoin Predictions:")
    print(json.dumps(btc_predictions, indent=2))
    
    # Test with Ethereum
    eth_predictions = generate_mock_predictions('ethereum', 7)
    print("\nEthereum Predictions:")
    print(json.dumps(eth_predictions, indent=2))
    
    # Save model
    save_model()
    
    print("\nAI model testing completed!")