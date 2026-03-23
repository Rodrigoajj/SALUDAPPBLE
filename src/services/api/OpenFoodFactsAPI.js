import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org/api/v0';

class OpenFoodFactsAPI {
  async getProductByBarcode(barcode) {
    try {
      const response = await axios.get(`${BASE_URL}/product/${barcode}.json`);

      if (response.data.status === 1) {
        const product = response.data.product;
        return this.transformProduct(product);
      }
      return null;
    } catch (error) {
      console.error('Error en OpenFoodFacts API:', error);
      return null;
    }
  }
  async searchProducts(query) {
    try {
      // Using search simple
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;
      const response = await axios.get(url, { timeout: 10000 });

      if (response.data && response.data.products) {
        return response.data.products
          .map(p => this.transformProduct(p))
          .filter(p => p !== null);
      }
      return [];
    } catch (error) {
      console.error('Error en OpenFoodFacts Search:', error.message);
      return [];
    }
  }

  transformProduct(product) {
    if (!product || !product.product_name || product.product_name.trim() === '') {
      return null;
    }
    const name = (product.product_name || '').toLowerCase();

    // Detectar si es un suplemento
    const supplementKeywords = ['creatina', 'creatine', 'proteina', 'protein', 'whey', 'suplemento', 'aminoacidos', 'bcaa', 'glutamina'];
    const isSupplement = supplementKeywords.some(keyword => name.includes(keyword)) ||
      (product.categories_tags && product.categories_tags.some(tag => tag.includes('supplement')));

    return {
      id: product.code || product.id,
      name: product.product_name,
      brand: product.brands,
      image_url: product.image_url || product.image_small_url,
      category: isSupplement ? 'suplemento' : 'alimento',
      details: {
        nutritionalInfo: {
          calories: parseFloat(product.nutriments?.['energy-kcal_100g']) || 0,
          proteins: parseFloat(product.nutriments?.proteins_100g) || 0,
          carbs: parseFloat(product.nutriments?.carbohydrates_100g) || 0,
          fats: parseFloat(product.nutriments?.fat_100g) || 0,
          sugar: parseFloat(product.nutriments?.sugars_100g) || 0,
          sodium: parseFloat(product.nutriments?.sodium_100g) || 0
        },
        ingredients: (
          product.ingredients_text_es ||
          product.ingredients_text ||
          product.ingredients_text_en ||
          product.ingredients_text_with_allergens ||
          ''
        )
          .split(/[,;\n]/)
          .map(i => i.trim())
          .filter(i => i !== '' && i.length > 2)
      }
    };
  }
}

export default new OpenFoodFactsAPI(); 