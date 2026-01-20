import axios from 'axios';

// Puedes usar APIs como Open Food Facts o UPC Database
const API_URL = 'https://world.openfoodfacts.org/api/v0/product/';

export const fetchProductInfo = async (barcode) => {
  try {
    const response = await axios.get(`${API_URL}${barcode}.json`);
    if (response.data.status === 1) {
      return transformProductData(response.data.product);
    }
    throw new Error('Producto no encontrado');
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

const transformProductData = (product) => {
  return {
    name: product.product_name,
    category: product.categories_tags?.[0] || 'Sin categoría',
    nutrition: {
      servingSize: product.serving_size || 'No especificado',
      calories: product.nutriments?.energy_100g || 0,
      protein: product.nutriments?.proteins_100g || 0,
      carbs: product.nutriments?.carbohydrates_100g || 0,
      fat: product.nutriments?.fat_100g || 0,
      fiber: product.nutriments?.fiber_100g || 0,
      sugar: product.nutriments?.sugars_100g || 0,
      vitamins: extractVitamins(product),
      minerals: extractMinerals(product)
    },
    allergens: product.allergens_tags?.map(cleanAllergenTag) || [],
    ingredients: product.ingredients_text_es?.split(',') || 
                product.ingredients_text?.split(',') || [],
    image: product.image_front_url,
    specifications: {
      brand: product.brands,
      quantity: product.quantity,
      packaging: product.packaging_tags,
    }
  };
};

const extractVitamins = (product) => {
  const vitamins = [];
  Object.keys(product.nutriments || {}).forEach(key => {
    if (key.toLowerCase().includes('vitamin')) {
      vitamins.push({
        name: key,
        amount: product.nutriments[key]
      });
    }
  });
  return vitamins;
};

const extractMinerals = (product) => {
  const minerals = [];
  const mineralKeys = ['iron', 'calcium', 'magnesium', 'zinc', 'potassium'];
  mineralKeys.forEach(mineral => {
    if (product.nutriments?.[mineral + '_100g']) {
      minerals.push({
        name: mineral,
        amount: product.nutriments[mineral + '_100g']
      });
    }
  });
  return minerals;
};

const cleanAllergenTag = (tag) => {
  return tag.replace('en:', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}; 