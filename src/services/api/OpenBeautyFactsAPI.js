import axios from 'axios';

const BASE_URL = 'https://world.openbeautyfacts.org/api/v0';

class OpenBeautyFactsAPI {
  async getProductByBarcode(barcode) {
    try {
      const response = await axios.get(`${BASE_URL}/product/${barcode}.json`);

      if (response.data.status === 1) {
        const product = response.data.product;
        return {
          id: barcode,
          name: product.product_name,
          brand: product.brands,
          category: 'higiene',
          details: {
            ingredients: (
              product.ingredients_text_es ||
              product.ingredients_text ||
              product.ingredients_text_en ||
              product.ingredients_text_with_allergens ||
              product.ingredients_text_debug ||
              ''
            )
              .split(/[,;\n]/) // Split by comma, semicolon or newline
              .map(i => i.trim())
              .filter(i => i !== '' && i.length > 2), // Filter out short strings/empty
            activeIngredients: this.parseActiveIngredients(product)
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Error en OpenBeautyFacts API:', error);
      return null;
    }
  }

  parseActiveIngredients(product) {
    // Intentar extraer ingredientes activos de diferentes campos
    const activeIngredients = [];
    if (product.ingredients_analysis) {
      Object.entries(product.ingredients_analysis).forEach(([key, value]) => {
        if (value === 'en:yes') {
          activeIngredients.push({
            name: key.replace('en:', ''),
            concentration: 'No especificada',
            purpose: 'No especificado'
          });
        }
      });
    }
    return activeIngredients;
  }
}

export default new OpenBeautyFactsAPI(); 