import AsyncStorage from '@react-native-async-storage/async-storage';

class RateLimitService {
  constructor() {
    this.limits = {
      OpenFoodFacts: { requests: 100, period: 3600000 }, // 100 requests per hour
      OpenBeautyFacts: { requests: 100, period: 3600000 },
      DailyMed: { requests: 200, period: 3600000 }
    };
  }

  async checkRateLimit(apiName) {
    try {
      const now = Date.now();
      const key = `rateLimit_${apiName}`;
      const stored = await AsyncStorage.getItem(key);
      let requests = stored ? JSON.parse(stored) : [];

      // Limpiar solicitudes antiguas
      requests = requests.filter(timestamp => 
        now - timestamp < this.limits[apiName].period
      );

      // Verificar si se excedió el límite
      if (requests.length >= this.limits[apiName].requests) {
        throw new Error(`Rate limit exceeded for ${apiName}`);
      }

      // Agregar nueva solicitud
      requests.push(now);
      await AsyncStorage.setItem(key, JSON.stringify(requests));

      return true;
    } catch (error) {
      console.error(`Rate limit error for ${apiName}:`, error);
      throw error;
    }
  }

  async getRemainingRequests(apiName) {
    try {
      const now = Date.now();
      const key = `rateLimit_${apiName}`;
      const stored = await AsyncStorage.getItem(key);
      const requests = stored ? JSON.parse(stored) : [];
      
      const validRequests = requests.filter(timestamp => 
        now - timestamp < this.limits[apiName].period
      );

      return this.limits[apiName].requests - validRequests.length;
    } catch (error) {
      console.error('Error getting remaining requests:', error);
      return 0;
    }
  }
}

export default new RateLimitService(); 