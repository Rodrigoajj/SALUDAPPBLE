export const evaluateForAthlete = (productData) => {
  const { nutrition } = productData;
  
  // Evaluación para atletas basada en macronutrientes
  if (nutrition) {
    const proteinContent = nutrition.protein;
    const carbContent = nutrition.carbs;
    
    if (proteinContent >= 20 && carbContent >= 30) {
      return {
        rating: 'excellent',
        reason: 'Alto contenido proteico y carbohidratos ideales para recuperación muscular'
      };
    } else if (proteinContent >= 15) {
      return {
        rating: 'good',
        reason: 'Buen aporte de proteínas para el desarrollo muscular'
      };
    }
  }
  
  return {
    rating: 'poor',
    reason: 'Bajo contenido de nutrientes para deportistas'
  };
};

export const evaluateForDiabetic = (productData) => {
  const { nutrition } = productData;
  
  if (nutrition) {
    const sugarContent = nutrition.sugar;
    const carbContent = nutrition.carbs;
    
    if (sugarContent <= 5 && carbContent <= 15) {
      return {
        rating: 'excellent',
        reason: 'Bajo en azúcares y carbohidratos, seguro para diabéticos'
      };
    } else if (sugarContent <= 10) {
      return {
        rating: 'good',
        reason: 'Moderado en azúcares, consumir con precaución'
      };
    }
  }
  
  return {
    rating: 'poor',
    reason: 'Alto contenido de azúcares, no recomendado para diabéticos'
  };
};

export const evaluateForSensitiveSkin = (productData) => {
  const { ingredients = [] } = productData;
  const harmfulIngredients = [
    'parabens', 'sulfates', 'alcohol', 'fragrance', 'parfum'
  ];
  
  const foundHarmful = harmfulIngredients.filter(ingredient => 
    ingredients.some(i => i.toLowerCase().includes(ingredient))
  );
  
  if (foundHarmful.length === 0) {
    return {
      rating: 'excellent',
      reason: 'Sin ingredientes irritantes comunes'
    };
  } else if (foundHarmful.length <= 2) {
    return {
      rating: 'good',
      reason: `Contiene algunos ingredientes que podrían ser irritantes: ${foundHarmful.join(', ')}`
    };
  }
  
  return {
    rating: 'poor',
    reason: 'Contiene múltiples ingredientes potencialmente irritantes'
  };
};

export const evaluateForGeneral = (productData) => {
  // Evaluación general basada en múltiples factores
  let score = 0;
  const reasons = [];
  
  if (productData.nutrition) {
    if (productData.nutrition.fiber >= 3) {
      score += 1;
      reasons.push('Buena fuente de fibra');
    }
    if (productData.nutrition.sugar <= 10) {
      score += 1;
      reasons.push('Bajo en azúcares');
    }
  }
  
  if (productData.allergens?.length === 0) {
    score += 1;
    reasons.push('Sin alérgenos comunes');
  }
  
  if (score >= 2) {
    return {
      rating: 'excellent',
      reason: reasons.join('. ')
    };
  } else if (score >= 1) {
    return {
      rating: 'good',
      reason: reasons.join('. ')
    };
  }
  
  return {
    rating: 'poor',
    reason: 'No cumple con suficientes criterios de salud general'
  };
}; 