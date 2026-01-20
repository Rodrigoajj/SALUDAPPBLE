import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org/api/v0';

class OpenFoodFactsAPI {
  async getProductByBarcode(barcode) {
    try {
      const response = await axios.get(`${BASE_URL}/product/${barcode}.json`);
      
      if (response.data.status === 1) {
        const product = response.data.product;
        return {
          id: barcode,
          name: product.product_name,
          brand: product.brands,
          category: 'alimento',
          details: {
            nutritionalInfo: {
              calories: parseFloat(product.nutriments['energy-kcal_100g']) || 0,
              proteins: parseFloat(product.nutriments.proteins_100g) || 0,
              carbs: parseFloat(product.nutriments.carbohydrates_100g) || 0,
              fats: parseFloat(product.nutriments.fat_100g) || 0,
              sugar: parseFloat(product.nutriments.sugars_100g) || 0,
              sodium: parseFloat(product.nutriments.sodium_100g) || 0
            },
            ingredients: product.ingredients_text_es ? 
              product.ingredients_text_es.split(',') : []
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Error en OpenFoodFacts API:', error);
      return null;
    }
  }
}

export default new OpenFoodFactsAPI(); 