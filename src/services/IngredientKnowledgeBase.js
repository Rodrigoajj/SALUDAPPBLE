
// Mock Knowledge Base for Ingredients
// This simulates an AI or comprehensive database

export const IngredientKnowledgeBase = {
    // --- SUPLEMENTOS / NUTRICIÓN ---
    'creatina': {
        name: 'Creatina Monohidratada',
        category: 'Suplemento Deportivo',
        safety: 'good',
        description: 'Compuesto orgánico nitrogenado que facilita el reciclaje de ATP, la moneda energética de la célula. Es el suplemento más estudiado para mejorar el rendimiento físico y la masa muscular.',
        dosage: 'Fase de carga (opcional): 20g/día por 5-7 días. Mantenimiento: 3-5g diarios.',
        benefits: ['Aumento de fuerza y potencia', 'Mejora la recuperación', 'Beneficios neuroprotectores'],
        risks: 'Puede causar retención de líquidos inicial o malestar estomacal si se toma sin suficiente agua. Seguro para riñones en personas sanas.',
        sources: 'Carne roja, pescado (en bajas cantidades), síntesis endógena.'
    },
    'proteina': {
        name: 'Proteína de Suero (Whey)',
        category: 'Suplemento Nutricional',
        safety: 'good',
        description: 'Fuente de proteína de alta calidad derivada de la leche, con alto valor biológico y rápida absorción. Rica en aminoácidos esenciales y BCAAs.',
        dosage: '20-30g post-entrenamiento o según requerimientos proteicos diarios (1.6-2.2g/kg peso corporal).',
        benefits: ['Síntesis proteica muscular', 'Saciedad', 'Mejora la composición corporal'],
        risks: 'Malestar digestivo en intolerantes a la lactosa (preferir aislado).',
        sources: 'Leche, queso, yogur.'
    },
    'cafeina': {
        name: 'Cafeína',
        category: 'Estimulante',
        safety: 'neutral',
        description: 'Alcaloide del grupo de las xantinas que actúa como estimulante del sistema nervioso central, reduciendo la fatiga y mejorando el estado de alerta.',
        dosage: '3-6 mg/kg de peso corporal. Máximo recomendado: 400mg/día.',
        benefits: ['Mejora el foco y concentración', 'Aumenta el gasto energético', 'Mejora el rendimiento aeróbico'],
        risks: 'Insomnio, ansiedad, taquicardia, dependencia. Evitar cerca de la hora de dormir.',
        sources: 'Café, té, guaraná, yerba mate.'
    },
    'vitamina c': {
        name: 'Vitamina C (Ácido Ascórbico)',
        category: 'Vitamina',
        safety: 'good',
        description: 'Vitamina hidrosoluble esencial con potente acción antioxidante. Clave para la síntesis de colágeno, absorción de hierro y función inmune.',
        dosage: '75-90mg (CDR). Hasta 1g/día en deportistas o situaciones de estrés.',
        benefits: ['Refuerza sistema inmune', 'Antioxidante', 'Mejora salud de la piel'],
        risks: 'Dosis > 2g pueden causar diarrea y malestar gastrointestinal. Riesgo de cálculos renales en propensos.',
        sources: 'Cítricos, kiwi, pimientos, fresas.'
    },
    'azucar': {
        name: 'Azúcar Añadido (Sacarosa)',
        category: 'Endulzante',
        safety: 'bad',
        description: 'Disacárido compuesto por glucosa y fructosa. Aporte calórico vacío sin valor nutricional. Su consumo excesivo es la principal causa de enfermedades metabólicas.',
        dosage: 'OMS recomienda < 25g/día (aprox 6 cucharaditas).',
        benefits: ['Energía rápida (útil intra-entreno puntual)'],
        risks: 'Obesidad, resistencia a la insulina, diabetes tipo 2, caries, inflamación crónica.',
        sources: 'Procesados, refrescos, dulces.'
    },

    // --- COSMÉTICA / HIGIENE ---
    'parabeno': {
        name: 'Parabenos (Metrapil, Propil...)',
        category: 'Conservante',
        safety: 'bad',
        description: 'Grupo de conservantes sintéticos utilizados para evitar crecimiento de hongos y bacterias. Controversiales por su potencial actividad como disruptores endocrinos (imitan estrógenos).',
        dosage: 'Regulado a concentraciones bajas (<0.4%). Evitar en productos sin enjuague (cremas).',
        benefits: ['Eficacia antimicrobiana', 'Estabilidad del producto'],
        risks: 'Posible alteración hormonal, irritación en pieles sensibles. Acumulativo.',
        sources: 'Champús, lociones, maquillaje.'
    },
    'sulfato': {
        name: 'Sulfatos (SLS/SLES)',
        category: 'Surfactante/Detergente',
        safety: 'neutral',
        description: 'Agentes limpiadores potentes que generan espuma y eliminan grasa. El Sodium Lauryl Sulfate (SLS) es más irritante que el Laureth (SLES).',
        dosage: 'Uso tópico en enjuague.',
        benefits: ['Limpieza profunda', 'Espuma abundante', 'Económico'],
        risks: 'Pueden resecar la piel y el cabello, eliminar aceites naturales, irritar ojos. Evitar en cabello teñido o rizado.',
        sources: 'Champú, gel de baño, pasta dental.'
    },
    'acido hialuronico': {
        name: 'Ácido Hialurónico',
        category: 'Hidratante',
        safety: 'good',
        description: 'Polisacárido presente naturalmente en la piel capaz de retener 1000 veces su peso en agua. Mantiene la hidratación y elasticidad.',
        dosage: 'Uso diario AM/PM. Concentraciones típicas 1-2%.',
        benefits: ['Hidratación profunda', 'Reducción de arrugas finas', 'Mejora textura'],
        risks: 'Muy seguro. Rara vez causa reacción alérgica.',
        sources: 'Cremas, serums, fillers.'
    },
    'retinol': {
        name: 'Retinol (Vitamina A)',
        category: 'Anti-edad',
        safety: 'good',
        description: 'Derivado de la Vitamina A. El estándar de oro en anti-envejecimiento. Acelera la renovación celular y estimula colágeno.',
        dosage: 'Empezar 0.2-0.5% 2 veces/semana. Uso nocturno exclusivo.',
        benefits: ['Reduce arrugas y manchas', 'Mejora textura y acné', 'Firmeza'],
        risks: 'Irritación, descamación, sensibilidad solar (usar SPF). No usar en embarazo.',
        sources: 'Serums, cremas nocturnas.'
    },
    'niacinamida': {
        name: 'Niacinamida (Vit B3)',
        category: 'Activo Cosmético',
        safety: 'good',
        description: 'Vitamina hidrosoluble muy versátil. Calma rojeces, regula sebo, mejora la barrera cutánea y reduce manchas.',
        dosage: 'Efectiva al 2-5%. Concentraciones mayores (10%+) pueden irritar.',
        benefits: ['Seborregulador', 'Anti-inflamatorio', 'Iluminador'],
        risks: 'Generalmente bien tolerada. Altas dosis pueden causar "flush" (enrojecimiento) temporal.',
        sources: 'Serums, tónicos, cremas.'
    },
    'aluminio': {
        name: 'Sales de Aluminio',
        category: 'Antitranspirante',
        safety: 'neutral',
        description: 'Ingrediente activo en antitranspirantes que bloquea temporalmente los conductos sudoríparos para reducir el sudor.',
        dosage: 'Uso tópico en axilas.',
        benefits: ['Control efectivo del sudor y olor'],
        risks: 'Irritación, manchas en ropa. Controversia (no probada) sobre acumulación. Bloquea un proceso natural (sudar).',
        sources: 'Desodorantes antitranspirantes.'
    },

    // --- ADITIVOS ALIMENTARIOS ---
    'glutamato': {
        name: 'Glutamato Monosódico (GMS)',
        category: 'Potenciador de Sabor',
        safety: 'neutral',
        description: 'Sal sódica del ácido glutámico. Realza el sabor "umami". Seguro según agencias, pero algunas personas reportan sensibilidad.',
        dosage: 'Consumo moderado.',
        benefits: ['Mejora palatabilidad de alimentos procesados'],
        risks: 'Sodio oculto. "Síndrome de restaurante chino" (dolor de cabeza, rubor) en sensibles.',
        sources: 'Salsas, snacks salados, comida asiática, caldos.'
    },
    'colorante': {
        name: 'Colorantes Artificiales (Rojo 40, Amarillo 5...)',
        category: 'Aditivo',
        safety: 'neutral',
        description: 'Pigmentos sintéticos derivados del petróleo usados para dar color vibrante. Puramente estéticos.',
        dosage: 'Límites de IDA establecidos por peso.',
        benefits: ['Estética visual'],
        risks: 'Posible relación con hiperactividad en niños sensibles (estudios mixtos). Posibles reacciones alérgicas.',
        sources: 'Dulces, bebidas, cereales.'
    }
};

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const getIngredientInfo = (searchTerm) => {
    if (!searchTerm) return null;
    const termRaw = searchTerm.toLowerCase().trim();
    const term = removeAccents(termRaw);

    // 1. Direct match (check both raw and normalized keys)
    if (IngredientKnowledgeBase[termRaw]) return IngredientKnowledgeBase[termRaw];

    const keys = Object.keys(IngredientKnowledgeBase);

    // 2. Fuzzy match loop (normalized)
    for (let key of keys) {
        const keyNorm = removeAccents(key);
        // Check if term contains key (e.g., "sulfato de sodio" contains "sulfato")
        // OR key contains term (e.g., "vitamina c" contains "vitamina")
        if (term.includes(keyNorm) || keyNorm.includes(term)) {
            return IngredientKnowledgeBase[key];
        }
    }

    // 3. Fallback for unknown ingredients
    return {
        name: searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1),
        category: 'Ingrediente Identificado',
        safety: 'unknown',
        description: 'No tenemos información detallada específica sobre este ingrediente en nuestra base de datos inteligente actual.',
        dosage: 'Consultar fuentes oficiales.',
        benefits: ['Componente de la fórmula'],
        risks: 'Desconocidos. Verificar alergias personales.',
        sources: 'Etiqueta del producto.'
    };
};
