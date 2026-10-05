import axios from 'axios';

const BASE_URL = 'https://dailymed.nlm.nih.gov/dailymed/services/v2';

class DailyMedAPI {
  async getProductByBarcode(barcode) {
    try {
      // DailyMed usa NDC (National Drug Code), que puede ser derivado del código de barras
      const response = await axios.get(`${BASE_URL}/ndc/${barcode}`);
      
      if (response.data) {
        const product = response.data;
        return {
          id: barcode,
          name: product.title,
          brand: product.labeler,
          category: 'medicamento',
          details: {
            activeIngredients: this.parseActiveIngredients(product),
            ingredients: this.parseInactiveIngredients(product)
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Error en DailyMed API:', error);
      return null;
    }
  }

  parseActiveIngredients(product) {
    if (!product.activeIngredients) return [];
    
    return product.activeIngredients.map(ingredient => ({
      name: ingredient.name,
      concentration: ingredient.strength,
      purpose: ingredient.purpose || 'No especificado'
    }));
  }

  parseInactiveIngredients(product) {
    return product.inactiveIngredients || [];
  }
}

export default new DailyMedAPI(); 