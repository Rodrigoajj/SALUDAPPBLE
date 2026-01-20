import OpenFoodFactsAPI from './api/OpenFoodFactsAPI';
import OpenBeautyFactsAPI from './api/OpenBeautyFactsAPI';
import DailyMedAPI from './api/DailyMedAPI';
import firestore from '@react-native-firebase/firestore';
import RateLimitService from './RateLimitService';

class ProductService {
  constructor() {
    this.UPDATE_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
  }

  async getProductByBarcode(barcode) {
    try {
      // Primero buscar en nuestra base de datos local
      const localProduct = await this.getLocalProduct(barcode);
      
      // Si existe y no necesita actualización, retornarlo
      if (localProduct && !this.needsUpdate(localProduct)) {
        return localProduct;
      }

      // Si no existe o necesita actualización, buscar en APIs externas
      const product = await this.searchExternalAPIs(barcode);
      
      if (product) {
        await this.saveProduct(product);
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
    
    const lastUpdate = product.lastUpdated.toDate();
    return Date.now() - lastUpdate > this.UPDATE_THRESHOLD;
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
    await firestore()
      .collection('products')
      .doc(product.id)
      .set({
        ...product,
        lastUpdated: firestore.FieldValue.serverTimestamp()
      });
  }

  // Método para actualización periódica en segundo plano
  async updateOutdatedProducts() {
    try {
      const outdatedProducts = await firestore()
        .collection('products')
        .where('lastUpdated', '<', new Date(Date.now() - this.UPDATE_THRESHOLD))
        .limit(10) // Procesar en lotes pequeños
        .get();

      const updatePromises = outdatedProducts.docs.map(async doc => {
        const product = doc.data();
        const updatedProduct = await this.searchExternalAPIs(product.id);
        
        if (updatedProduct) {
          await this.saveProduct(updatedProduct);
        }
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating outdated products:', error);
    }
  }
}

export default new ProductService(); 