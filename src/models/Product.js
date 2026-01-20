// Estructura de datos para productos
const productSchema = {
  id: 'string', // código de barras
  name: 'string',
  brand: 'string',
  category: 'string', // alimento, higiene, dermacológico, etc.
  details: {
    // Para alimentos
    nutritionalInfo: {
      calories: 'number',
      proteins: 'number',
      carbs: 'number',
      fats: 'number',
      sugar: 'number',
      sodium: 'number'
    },
    // Para productos de higiene/dermacológicos
    ingredients: ['string'],
    activeIngredients: [{
      name: 'string',
      concentration: 'string',
      purpose: 'string'
    }]
  },
  healthAssessment: {
    groups: [{
      type: 'string', // "diabéticos", "deportistas", "embarazadas", etc.
      rating: 'number', // 1-5 (1: muy malo, 5: muy bueno)
      explanation: 'string', // Explicación científica del rating
      recommendations: 'string' // Recomendaciones de uso/consumo
    }],
    warnings: ['string'], // Advertencias generales
    contraindications: ['string']
  },
  alternatives: ['string'] // IDs de productos alternativos más saludables
}; 