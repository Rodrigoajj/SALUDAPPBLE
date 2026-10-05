import OpenFoodFactsAPI from './api/OpenFoodFactsAPI';
import OpenBeautyFactsAPI from './api/OpenBeautyFactsAPI';
import DailyMedAPI from './api/DailyMedAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RateLimitService from './RateLimitService';
import AIService from './AIService';

class ProductService {
  constructor() {
    this.UPDATE_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
    this.HISTORY_KEY = 'healthscan_history_list';
    this.STORAGE_KEY = 'healthscan_products_storage';
  }

  async getLocalProduct(barcode) {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      const products = JSON.parse(stored);
      return products[barcode] || null;
    } catch (e) {
      console.warn('Error reading local product', e);
      return null;
    }
  }

  async getProductByBarcode(barcode) {
    try {
      // Primero buscar en nuestra base de datos local
      const localProduct = await this.getLocalProduct(barcode);

      const hasNoIngredients = !localProduct || !localProduct.details?.ingredients || localProduct.details.ingredients.length === 0;

      // Si existe y no necesita actualización Y tiene ingredientes, retornarlo
      if (localProduct && !this.needsUpdate(localProduct) && !hasNoIngredients) {
        // MIGRACIÓN: Si la evaluación es antigua o falta, re-evaluar con el nuevo AIService
        if (!localProduct.healthAssessment || !localProduct.healthAssessment.status || !localProduct.healthAssessment.ingredientAnalysis) {
          console.log(`[ProductService] Re-evaluando producto (análisis incompleto): ${localProduct.name}`);
          localProduct.healthAssessment = await AIService.evaluateProduct(localProduct);
          await this.saveProduct(localProduct);
        }
        await this.addToHistory(localProduct);
        return localProduct;
      }

      // Si no existe o necesita actualización, buscar en APIs externas
      let product = null;
      try {
        product = await this.searchExternalAPIs(barcode);
      } catch (err) {
        console.warn('API error, using fallback if available');
      }

      // FALLBACK PARA TESTING SI ESTAMOS OFFLINE O API FALLA
      if (!product && (barcode === '7501055310866' || barcode === '123456')) {
        product = {
          id: barcode,
          name: "Coca Cola Original 600ml",
          brand: "Coca Cola",
          image_url: "https://images.openfoodfacts.org/images/products/750/105/531/0866/front_es.3.400.jpg",
          category: "alimento",
          lastUpdated: new Date().toISOString(),
          details: {
            nutritionalInfo: {
              sugar: 25,
              calories: 140
            }
          }
        };
      }

      if (product) {
        // Enriquecer con evaluación de salud real usando AI
        product.healthAssessment = await AIService.evaluateProduct(product);

        await this.saveProduct(product);
        await this.addToHistory(product);
        return product;
      }

      // Si no se encontró en APIs pero existe localmente, retornar versión local
      return localProduct || null;
    } catch (error) {
      console.error('Error en ProductService:', error);
      throw error;
    }
  }


  needsUpdate(product) {
    if (!product.lastUpdated) return true;

    const lastUpdate = new Date(product.lastUpdated); // AsyncStorage stores dates as strings
    return Date.now() - lastUpdate.getTime() > this.UPDATE_THRESHOLD;
  }

  async searchByName(query) {
    try {
      await RateLimitService.checkRateLimit('OpenFoodFacts');
      return await OpenFoodFactsAPI.searchProducts(query);
    } catch (error) {
      console.error('Error searching products by name:', error);
      return [];
    }
  }

  async searchExternalAPIs(barcode) {
    const apis = [
      { name: 'OpenFoodFacts', api: OpenFoodFactsAPI },
      { name: 'OpenBeautyFacts', api: OpenBeautyFactsAPI },
      { name: 'DailyMed', api: DailyMedAPI }
    ];

    for (const { name, api } of apis) {
      try {
        // Verificar rate limit antes de cada llamada
        await RateLimitService.checkRateLimit(name);

        const product = await api.getProductByBarcode(barcode);
        if (product) return product;
      } catch (error) {
        if (error.message.includes('Rate limit exceeded')) {
          console.warn(`Rate limit exceeded for ${name}, trying next API...`);
          continue;
        }
        console.error(`Error with ${name}:`, error);
      }
    }

    return null;
  }

  async saveProduct(product) {
    try {
      const productToSave = {
        ...product,
        lastUpdated: new Date().toISOString()
      };

      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      const products = stored ? JSON.parse(stored) : {};
      products[product.id] = productToSave;

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving product locally', e);
    }
  }

  // --- HISTORY MANAGEMENT ---

  async addToHistory(product) {
    if (!product || !product.name || product.name.trim() === '') return;
    try {
      const historyItem = {
        id: product.id, // barcode
        name: product.name,
        brand: product.brand,
        image_url: product.image_url,
        status: product.healthAssessment?.status || 'unknown',
        timestamp: new Date().toISOString()
      };

      const stored = await AsyncStorage.getItem(this.HISTORY_KEY);
      let history = stored ? JSON.parse(stored) : [];

      // Remove duplicates (move to top)
      history = history.filter(item => item.id !== product.id);

      // Add to beginning
      history.unshift(historyItem);

      // Limit size (e.g., 50 items)
      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      await AsyncStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error adding to history', e);
    }
  }

  async getHistory() {
    try {
      const stored = await AsyncStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error getting history', e);
      return [];
    }
  }

  async clearHistory() {
    try {
      await AsyncStorage.removeItem(this.HISTORY_KEY);
    } catch (e) {
      console.error('Error clearing history', e);
    }
  }

  // Método para actualización periódica en segundo plano - Simplified for local storage
  async updateOutdatedProducts() {
    // Implementation skipped for local storage version to keep it simple
  }
}

export default new ProductService(); 