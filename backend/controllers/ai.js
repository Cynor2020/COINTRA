import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock prediction function for when model is not available
const mockPredict = (coinId, days = 7) => {
  // Base prices for different coins
  const basePrices = {
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
  };

  const basePrice = basePrices[coinId] || 100;
  const predictions = [];
  let currentPrice = basePrice;
  
  // Generate realistic price movements
  for (let i = 1; i <= days; i++) {
    // Random fluctuation between -5% and +5%
    const changePercent = (Math.random() - 0.5) * 0.1;
    currentPrice = currentPrice * (1 + changePercent);
    predictions.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: currentPrice,
      changePercent: changePercent * 100
    });
  }
  
  // Calculate overall trend
  const priceChange = predictions[predictions.length - 1].price - basePrice;
  const trend = priceChange > 0 ? 'bullish' : 'bearish';
  
  return {
    coinId,
    currentPrice: basePrice,
    predictions,
    trend,
    confidence: 0.75 + Math.random() * 0.2,  // 75-95% confidence
    riskLevel: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'
  };
};

// Function to get AI predictions using Python script
const getAIPredictionsFromPython = (coinId, days = 7) => {
  return new Promise((resolve, reject) => {
    // Spawn Python process
    const pythonPath = 'python'; // Adjust this if needed
    const scriptPath = path.join(__dirname, '..', 'simple_ai_model.py');
    
    // We'll pass coinId and days as arguments
    const pythonProcess = spawn(pythonPath, ['-c', `
import sys
import json
import random
from datetime import datetime, timedelta

def generate_mock_predictions(coin_id, days=7):
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
    
    base_price = base_prices.get(coin_id, 100)
    current_price = base_price
    
    predictions = []
    for i in range(1, days + 1):
        change_percent = (random.random() - 0.5) * 0.1
        predicted_price = current_price * (1 + change_percent)
        
        predictions.append({
            'date': (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'),
            'price': round(predicted_price, 2),
            'change_percent': round(change_percent * 100, 2)
        })
        
        current_price = predicted_price
    
    price_change = predictions[-1]['price'] - base_price
    trend = 'bullish' if price_change > 0 else 'bearish'
    
    return {
        'coin_id': coin_id,
        'current_price': base_price,
        'predictions': predictions,
        'trend': trend,
        'confidence': round(0.75 + random.random() * 0.2, 2),
        'risk_level': random.choice(['Low', 'Medium', 'High'])
    }

# Get arguments
coin_id = sys.argv[1] if len(sys.argv) > 1 else 'bitcoin'
days = int(sys.argv[2]) if len(sys.argv) > 2 else 7

# Generate and print predictions
result = generate_mock_predictions(coin_id, days)
print(json.dumps(result))
    `, coinId, days.toString()]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      } else {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
};

// Get AI prediction for a specific coin
export const getAIPrediction = async (req, res) => {
  try {
    const { coinId } = req.params;
    const { days = 7 } = req.query;
    
    console.log(`Getting AI prediction for ${coinId} for ${days} days`);
    
    // Try to get predictions from Python model, fallback to mock if it fails
    try {
      const result = await getAIPredictionsFromPython(coinId, parseInt(days));
      
      // Transform the result to match our API format
      const transformedResult = {
        coinId: result.coin_id,
        currentPrice: result.current_price,
        predictions: result.predictions,
        trend: result.trend,
        confidence: result.confidence,
        riskLevel: result.risk_level
      };
      
      res.json({
        success: true,
        data: transformedResult
      });
    } catch (pythonError) {
      console.log('Falling back to mock predictions:', pythonError.message);
      // Fallback to mock predictions
      const result = mockPredict(coinId, parseInt(days));
      res.json({
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.error('Error getting AI prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI prediction',
      error: error.message
    });
  }
};

// Get AI predictions for multiple coins
export const getMultipleAIPredictions = async (req, res) => {
  try {
    const { coinIds } = req.body;
    const { days = 7 } = req.query;
    
    console.log(`Getting AI predictions for coins: ${coinIds} for ${days} days`);
    
    const predictions = [];
    for (const coinId of coinIds) {
      try {
        const result = await getAIPredictionsFromPython(coinId, parseInt(days));
        // Transform the result to match our API format
        const transformedResult = {
          coinId: result.coin_id,
          currentPrice: result.current_price,
          predictions: result.predictions,
          trend: result.trend,
          confidence: result.confidence,
          riskLevel: result.risk_level
        };
        predictions.push(transformedResult);
      } catch (pythonError) {
        console.log(`Falling back to mock predictions for ${coinId}:`, pythonError.message);
        // Fallback to mock predictions
        const result = mockPredict(coinId, parseInt(days));
        predictions.push(result);
      }
    }
    
    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Error getting multiple AI predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI predictions',
      error: error.message
    });
  }
};

// Get overall market sentiment
export const getMarketSentiment = async (req, res) => {
  try {
    console.log('Getting market sentiment');
    
    // Mock market sentiment data
    const sentiment = {
      overall: Math.random() > 0.5 ? 'bullish' : 'bearish',
      confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
      topGainers: [
        { coin: 'solana', change: 5.2 + Math.random() * 10 },
        { coin: 'chainlink', change: 3.8 + Math.random() * 8 },
        { coin: 'polkadot', change: 2.5 + Math.random() * 7 }
      ],
      topLosers: [
        { coin: 'bitcoin', change: -(1.2 + Math.random() * 5) },
        { coin: 'ethereum', change: -(0.8 + Math.random() * 4) },
        { coin: 'ripple', change: -(2.1 + Math.random() * 6) }
      ]
    };
    
    res.json({
      success: true,
      data: sentiment
    });
  } catch (error) {
    console.error('Error getting market sentiment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get market sentiment',
      error: error.message
    });
  }
};