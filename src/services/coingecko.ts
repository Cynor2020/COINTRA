import axios from 'axios';

const COINGECKO_PRO_API = 'https://pro-api.coingecko.com/api/v3';
const API_KEY = 'CG-PTRsfsw7QueiEQ3kfTz8Thc1';

const api = axios.create({
  baseURL: COINGECKO_PRO_API,
  headers: {
    'x-cg-pro-api-key': API_KEY,
  },
});

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface MarketChartResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const getCoinMarkets = async (vsCurrency = 'inr', perPage = 100): Promise<Coin[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: 1,
        sparkline: true,
        price_change_percentage: '7d',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching coin markets:', error.response?.data || error.message);
    throw new Error(`Failed to fetch coin data: ${error.response?.statusText || error.message}`);
  }
};

export const getCoinMarketChart = async (coinId: string, days = 7, vsCurrency = 'inr'): Promise<MarketChartResponse> => {
  try {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vsCurrency,
        days: days,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching market chart:', error.response?.data || error.message);
    throw new Error(`Failed to fetch chart data: ${error.response?.statusText || error.message}`);
  }
};