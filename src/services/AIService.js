/**
 * AIService - Simulated AI for health recommendations
 * In a real-world scenario, this would call an LLM API (like Gemini)
 */
import VerifiedService from './VerifiedService';

class AIService {
    /**
     * Evaluates a product based on its category and details
     * @param {Object} product - The product object from the API
     * @returns {Object} healthAssessment - Categorized evaluation
     */
    async evaluateProduct(product) {
        if (!product) return null;
        // Check if we need to force a re-evaluation if ingredients were previously missing
        const hasNoAnalysis = !product.healthAssessment || !product.healthAssessment.ingredientAnalysis;
        const nowHasIngredients = product.details?.ingredients?.length > 0;

        if (hasNoAnalysis && nowHasIngredients) {
            console.log(`[AIService] Detectando ingredientes nuevos para ${product.name}, forzando re-evaluación.`);
        }

        let category = product.category || 'general';
        const name = (product.name || '').toLowerCase();

        // Refinamiento: Detectar suplementos incluso si la API los marcó como alimento
        // Refinamiento de categoría
        const supplementKeywords = ['creatina', 'creatine', 'proteina', 'protein', 'whey', 'suplemento', 'aminoacidos', 'bcaa', 'glutamina', 'magnesio', 'vitamin'];
        const hygieneKeywords = ['shampoo', 'champu', 'jabon', 'soap', 'crema', 'locion', 'desodorante', 'pasta dental', 'enjuague', 'acondicionador', 'body wash'];
        const cosmeticKeywords = ['maquillaje', 'labial', 'mascara', 'rimel', 'base', 'polvo facial', 'delineador'];

        if (category === 'alimento') {
            if (supplementKeywords.some(k => name.includes(k))) {
                console.log(`[AIService] Refinando categoría para ${product.name}: alimento -> suplemento`);
                category = 'suplemento';
            } else if (hygieneKeywords.some(k => name.includes(k))) {
                console.log(`[AIService] Refinando categoría para ${product.name}: alimento -> higiene`);
                category = 'higiene';
            }
        }

        if (category === 'general' || !category) {
            if (hygieneKeywords.some(k => name.includes(k))) category = 'higiene';
            else if (cosmeticKeywords.some(k => name.includes(k))) category = 'cosmetico';
            else if (supplementKeywords.some(k => name.includes(k))) category = 'suplemento';
            else category = 'alimento'; // Default fallback assumption
        }

        const evaluation = await this.performEvaluation(category, product);

        // Agregar análisis de ingredientes destacados
        evaluation.ingredientAnalysis = this.analyzeIngredients(product.details?.ingredients || [], category);

        return evaluation;
    }

    async performEvaluation(category, product) {
        switch (category) {
            case 'alimento':
                return this.evaluateFood(product);
            case 'suplemento':
                return this.evaluateSupplement(product);
            case 'higiene':
            case 'cosmetico':
                return this.evaluateCosmetic(product);
            case 'medicamento':
                return this.evaluateMedication(product);
            default:
                return this.evaluateGeneral(product);
        }
    }

    analyzeIngredients(ingredients, category) {
        const lowerIngredients = ingredients.map(i => i.toLowerCase().trim());
        const good = [];
        const bad = [];

        // Diccionarios extendidos con explicaciones
        const database = {
            alimento: {
                good: [
                    { key: 'avena', name: 'Avena Integral', reason: 'Excelente fuente de fibra y energía duradera.' },
                    { key: 'quinoa', name: 'Quinoa', reason: 'Proteína completa y rica en minerales.' },
                    { key: 'chia', name: 'Semillas de Chía', reason: 'Ricas en Omega-3 y antioxidantes.' },
                    { key: 'almendras', name: 'Almendras', reason: 'Grasas saludables y vitamina E.' },
                    { key: 'proteina aislada', name: 'Aislado de Proteína', reason: 'Alta pureza proteica para recuperación.' },
                    { key: 'fruta', name: 'Fruta Natural', reason: 'Vitaminas y fibra natural.' }
                ],
                bad: [
                    { key: 'azúcar', name: 'Azúcar Añadido', reason: 'Impacto negativo en glucosa y peso.' },
                    { key: 'jarabe de maíz', name: 'JMAF', reason: 'Edulcorante altamente procesado.' },
                    { key: 'aceite de palma', name: 'Aceite de Palma', reason: 'Grasas saturadas y proceso industrial.' },
                    { key: 'grasas trans', name: 'Grasas Trans', reason: 'Altamente perjudiciales para el corazón.' },
                    { key: 'glutamato', name: 'Glutamato', reason: 'Potenciador de sabor artificial.' }
                ]
            },
            higiene: {
                good: [
                    { key: 'aloe vera', name: 'Aloe Vera', reason: 'Hidratante y calmante natural.' },
                    { key: 'ácido hialurónico', name: 'Ácido Hialurónico', reason: 'Retenedor de humedad premium.' },
                    { key: 'glicerina', name: 'Glicerina', reason: 'Humectante eficaz para la barrera cutánea.' },
                    { key: 'pantenol', name: 'Pantenol (Vit B5)', reason: 'Repara y suaviza la piel.' }
                ],
                bad: [
                    { key: 'paraben', name: 'Parabenos', reason: 'Conservantes bajo sospecha hormonal.' },
                    { key: 'sulfate', name: 'Sulfatos (SLS)', reason: 'Detergentes agresivos que resecan.' },
                    { key: 'silicone', name: 'Siliconas', reason: 'Efecto oclusivo que impide respirar a la piel.' },
                    { key: 'alcohol', name: 'Alcohol Denat', reason: 'Puede irritar y secar pieles sensibles.' }
                ]
            },
            suplemento: {
                good: [
                    { key: 'creatina monohidrato', name: 'Creatina Monohidrato', reason: 'Forma más estudiada y segura.' },
                    { key: 'whey protein isolate', name: 'Whey Isolate', reason: 'Máxima absorción y pureza.' },
                    { key: 'magnesio citrato', name: 'Citrato de Magnesio', reason: 'Alta biodisponibilidad.' }
                ],
                bad: [
                    { key: 'aspartamo', name: 'Aspartamo', reason: 'Edulcorante artificial controversial.' },
                    { key: 'maltodextrina', name: 'Maltodextrina', reason: 'Índice glucémico muy elevado.' },
                    { key: 'dióxido de titanio', name: 'Dióxido de Titanio', reason: 'Aditivo blanqueador cuestionado.' }
                ]
            }
        };

        const catDb = database[category] || database.alimento;

        lowerIngredients.forEach(ing => {
            const foundGood = catDb.good.find(g => ing.includes(g.key));
            const foundBad = catDb.bad.find(b => ing.includes(b.key));

            if (foundGood) good.push(foundGood);
            if (foundBad) bad.push(foundBad);
        });

        // Retornar tops únicos
        return {
            best: Array.from(new Set(good.map(g => g.key))).map(key => good.find(g => g.key === key)),
            poor: Array.from(new Set(bad.map(b => b.key))).map(key => bad.find(b => b.key === key))
        };
    }

    evaluateSupplement(product) {
        const name = product.name?.toLowerCase() || '';
        const ingredients = product.details?.ingredients?.map(i => i.toLowerCase()) || [];

        let status = 'good';
        let rating = 4;
        const reasons = [];
        const recommendations = [];

        if (name.includes('creatina')) {
            reasons.push('La creatina es un suplemento seguro y bien estudiado para el rendimiento físico.');
            recommendations.push('Asegurarse de mantener una buena hidratación durante su uso.');
        } else if (name.includes('proteina') || name.includes('whey')) {
            reasons.push('Suplemento proteico para complementar la ingesta diaria.');
            recommendations.push('No debe sustituir comidas completas.');
        } else {
            reasons.push('Suplemento dietético para necesidades específicas.');
            recommendations.push('Consultar con un nutricionista para ajustar la dosis.');
        }

        return {
            status,
            score: rating,
            groups: [
                {
                    type: 'Uso Deportivo / Salud',
                    rating: rating,
                    explanation: reasons.join(' '),
                    recommendations: recommendations.join(' ')
                }
            ],
            warnings: ['Los suplementos no reemplazan una dieta equilibrada.'],
            contraindications: ['No recomendado para menores de 18 años sin supervisión profesional.']
        };
    }

    evaluateFood(product) {
        const info = product.details?.nutritionalInfo || {};
        const sugar = info.sugar || 0;
        const fats = info.fats || 0;
        const calories = info.calories || 0;
        const sodium = info.sodium || 0;

        let status = 'good';
        let rating = 5;
        const reasons = [];

        if (sugar > 15) {
            reasons.push('alto contenido de azúcar');
            rating -= 2;
        }
        if (sodium > 0.4) {
            reasons.push('elevado nivel de sodio');
            rating -= 1;
        }
        if (fats > 20) {
            reasons.push('muchas grasas saturadas');
            rating -= 1;
        }

        if (rating <= 2) status = 'bad';
        else if (rating <= 4) status = 'regular';

        return {
            status,
            score: rating,
            groups: [
                {
                    type: 'Nutrición',
                    rating: rating,
                    explanation: reasons.length > 0
                        ? `Este producto es ${status} debido a ${reasons.join(' y ')}.`
                        : 'Este producto tiene un excelente perfil nutricional.',
                    recommendations: status === 'bad'
                        ? 'Uso ocasional recomendado. Priorizar versiones bajas en azúcar.'
                        : 'Puede formar parte de una dieta equilibrada.'
                },
                {
                    type: 'Diabéticos',
                    rating: sugar > 10 ? 1 : 5,
                    explanation: sugar > 10 ? 'Contiene azúcares que pueden elevar la glucosa rápidamente.' : 'Bajo en azúcar, apto para la mayoría de dietas controladas.',
                    recommendations: sugar > 10 ? 'Evitar o consultar con su médico.' : 'Uso seguro bajo supervisión.'
                }
            ],
            warnings: sugar > 20 ? ['Alto en azúcares'] : [],
            contraindications: []
        };
    }

    evaluateCosmetic(product) {
        const ingredients = product.details?.ingredients || [];
        const controversial = ['paraben', 'sulfate', 'silicone', 'alcohol'];
        const found = ingredients.filter(i =>
            controversial.some(c => i.toLowerCase().includes(c))
        );

        let status = 'good';
        let rating = 5;

        if (found.length > 2) {
            status = 'bad';
            rating = 2;
        } else if (found.length > 0) {
            status = 'regular';
            rating = 3;
        }

        return {
            status,
            score: rating,
            groups: [
                {
                    type: 'Seguridad Química',
                    rating: rating,
                    explanation: found.length > 0
                        ? `Contiene ingredientes como ${found.join(', ')} que pueden ser irritantes.`
                        : 'Ingredientes limpios y seguros para la mayoría de pieles.',
                    recommendations: found.length > 0
                        ? 'Realizar una prueba en el antebrazo antes de usar.'
                        : 'Ideal para uso diario.'
                }
            ],
            warnings: found.length > 0 ? ['Contiene químicos irritantes'] : [],
            contraindications: []
        };
    }

    evaluateMedication(product) {
        // Las medicinas siempre requieren precaución, así que el status es 'regular' por defecto a menos que sea algo muy común
        return {
            status: 'regular',
            score: 3,
            groups: [
                {
                    type: 'Uso Clínico',
                    rating: 4,
                    explanation: 'Medicamento registrado con principios activos validados.',
                    recommendations: 'Seguir estrictamente la dosis prescrita por su médico.'
                },
                {
                    type: 'Seguridad',
                    rating: 3,
                    explanation: 'Todo medicamento puede tener efectos secundarios.',
                    recommendations: 'No automedicarse. Leer el prospecto adjunto.'
                }
            ],
            warnings: ['Requiere receta médica o supervisión'],
            contraindications: ['Consulte el prospecto para ver interacciones con otros fármacos']
        };
    }

    evaluateGeneral(product) {
        return {
            status: 'regular',
            score: 3,
            groups: [
                {
                    type: 'Evaluación General',
                    rating: 3,
                    explanation: 'Información limitada para este tipo de producto.',
                    recommendations: 'Investigar más sobre sus componentes específicos.'
                }
            ],
            warnings: [],
            contraindications: []
        };
    }

    detectSubCategory(name, category, ingredients) {
        const n = name.toLowerCase();
        const i = ingredients.map(ing => ing.toLowerCase()).join(' ');

        // --- HIGIENE Y BELLEZA ---
        if (category === 'higiene' || category === 'cosmetico') {
            if (this.matches(n, ['solar', 'bloqueador', 'sun', 'spf', 'uv', 'protección'])) return 'sun-care';
            if (this.matches(n, ['pasta', 'diente', 'dentífrico', 'oral', 'enjuague', 'bucal', 'bocal'])) return 'oral-care';
            if (this.matches(n, ['shampoo', 'champú', 'acondicionador', 'pelo', 'cabello', 'capilar', 'mascarilla'])) return 'hair-care';
            if (this.matches(n, ['desodorante', 'antitranspirante', 'axila'])) return 'deodorant';
            if (this.matches(n, ['cara', 'facial', 'rostro', 'serum', 'tónico', 'contorno'])) return 'skincare-face';
            if (this.matches(n, ['perfume', 'colonia', 'fragancia', 'eaud', 'parfum'])) return 'fragrance';
            if (this.matches(n, ['maquillaje', 'base', 'labial', 'sombras', 'rimel', 'mascara', 'polvo'])) return 'makeup';
            if (this.matches(n, ['jabon', 'jabón', 'gel', 'ducha', 'baño', 'corporal'])) return 'body-wash';
            return 'skincare-general'; // Default for cosmetics
        }

        // --- ALIMENTOS ---
        if (category === 'alimento' || category === 'bebida') {
            if (this.matches(n, ['refresco', 'soda', 'gaseosa', 'cola', 'bebida', 'energética'])) return 'soda';
            if (this.matches(n, ['leche', 'yogur', 'yogurt', 'queso', 'mantequilla', 'lacteo', 'nata'])) return 'dairy';
            if (this.matches(n, ['jamón', 'salchicha', 'embutido', 'carne', 'tocino', 'chorizo', 'pavo'])) return 'processed-meat';
            if (this.matches(n, ['cereal', 'avena', 'granola', 'trigo', 'maíz', 'arroz', 'pasta', 'harina', 'pan'])) return 'grains';
            if (this.matches(n, ['salsa', 'ketchup', 'mayonesa', 'mostaza', 'aderezo', 'vinagreta', 'soja'])) return 'sauce';
            if (this.matches(n, ['chicle', 'gum', 'gomita', 'goma de mascar', 'caramelo', 'pastilla', 'mints', 'candy'])) return 'snack-sweet'; // Candy maps to snack-sweet (strictness 5)
            if (this.matches(n, ['dulce', 'galleta', 'chocolate', 'bombón', 'confite', 'postre', 'pastel'])) return 'snack-sweet';
            if (this.matches(n, ['papas', 'fritas', 'chips', 'nachos', 'salado', 'snack'])) return 'snack-salty';
            if (this.matches(n, ['vino', 'cerveza', 'licor', 'alcohol', 'vodka', 'whisky'])) return 'alcohol';
            if (this.matches(n, ['agua', 'mineral'])) return 'water';
            return 'food-general';
        }

        // --- SUPLEMENTOS ---
        if (category === 'suplemento') {
            if (this.matches(n, ['whey', 'proteína', 'protein', 'aislado'])) return 'protein';
            if (this.matches(n, ['creatina', 'creatine'])) return 'creatine';
            if (this.matches(n, ['vitamina', 'multivitaminico', 'mineral', 'zinc', 'magnesio', 'hierro'])) return 'vitamin';
            if (this.matches(n, ['pre-workout', 'pre entreno', 'cafeína', 'caffeine'])) return 'pre-workout';
            return 'supplement-general';
        }

        return 'general';
    }

    matches(text, keywords) {
        return keywords.some(k => text.includes(k));
    }

    getCategoryRules(subCategory) {
        const rules = {
            // BEBIDAS & ALIMENTOS
            'soda': {
                strictness: 5, focus: 'Metabolic-Health', pro: 'Diabetólogo o Nutricionista',
                perspective: 'Bebida con alto potencial de impacto glucémico. El ácido fosfórico y azúcares simples pueden afectar la salud dental y metabólica.'
            },
            'dairy': {
                strictness: 3, focus: 'Bone-Gut-Health', pro: 'Nutricionista',
                perspective: 'Fuente primaria de calcio y proteínas. Evaluar contenido de grasas saturadas y lactosa según tolerancia digestiva.'
            },
            'processed-meat': {
                strictness: 5, focus: 'Cardiovascular', pro: 'Cardiólogo',
                perspective: 'Atención al contenido de sodio y nitritos conservantes. Su uso frecuente se asocia con riesgo cardiovascular.'
            },
            'grains': {
                strictness: 3, focus: 'Glycemic-Control', pro: 'Nutricionista',
                perspective: 'Base energética. Preferir versiones integrales para mantener niveles de glucosa estables y mejorar la digestión.'
            },
            'sauce': {
                strictness: 4, focus: 'Sodium-Control', pro: 'Nutricionista',
                perspective: 'Suele ocultar altas cantidades de sodio y azúcares añadidos. Usar con moderación para control de presión arterial.'
            },
            'snack-sweet': {
                strictness: 5, focus: 'Metabolic-Health', pro: 'Diabetólogo',
                perspective: 'Alta densidad calórica con baja saciedad. Provoca picos de insulina que favorecen el almacenamiento de grasa.'
            },
            'snack-salty': {
                strictness: 5, focus: 'Cardiovascular', pro: 'Nutricionista',
                perspective: 'Grasas inflamatorias y exceso de sodio. Impacto directo en la retención de líquidos y salud arterial.'
            },
            'alcohol': {
                strictness: 5, focus: 'Liver-Health', pro: 'Hepatólogo',
                perspective: 'Toxina hepática directa. Aporta calorías vacías y deshidrata. Su uso debe ser esporádico y moderado.'
            },
            'water': {
                strictness: 1, focus: 'Hydration', pro: 'Nutricionista',
                perspective: 'Hidratación pura. Esencial para todas las funciones biológicas.'
            },
            'food-general': {
                strictness: 3, focus: 'Nutrition-Balance', pro: 'Nutricionista',
                perspective: 'Evaluar en el contexto de una dieta balanceada.'
            },

            // BELLEZA Y HIGIENE
            'sun-care': {
                strictness: 5, focus: 'UV-Protection', pro: 'Dermatólogo',
                perspective: 'Barrera crítica contra daño celular y fotoenvejecimiento. Verificar espectro amplio y fotoestabilidad.'
            },
            'oral-care': {
                strictness: 5, focus: 'Oral-Health', pro: 'Odontólogo',
                perspective: 'Evaluar abrasividad y presencia de flúor/hidroxiapatita para remineralización del esmalte.'
            },
            'hair-care': {
                strictness: 4, focus: 'Hair-Health', pro: 'Tricólogo',
                perspective: 'Balance de limpieza y lípidos. Evitar detergentes agresivos si hay sensibilidad capilar.'
            },
            'skincare-face': {
                strictness: 5, focus: 'Skin-Barrier', pro: 'Dermatólogo',
                perspective: 'Formulación crítica por absorción directa. Priorizar ingredientes no comedogénicos y biocompatibles.'
            },
            'deodorant': {
                strictness: 4, focus: 'Skin-Balance', pro: 'Dermatólogo',
                perspective: 'Zona de alta absorción. Vigilar irritantes como alcohol o sales de aluminio en pieles sensibles.'
            },
            'fragrance': {
                strictness: 3, focus: 'Respiratory/Skin', pro: 'Alergólogo',
                perspective: 'Potencial alergénico alto por fragancias sintéticas y fijadores. Usar con precaución en pieles atópicas.'
            },
            'makeup': {
                strictness: 4, focus: 'Non-Comedogenic', pro: 'Dermatólogo',
                perspective: 'Contacto prolongado. Asegurar que permite la transpiración y no obstruye poros.'
            },
            'body-wash': {
                strictness: 3, focus: 'Hydro-Lipidic', pro: 'Dermatólogo',
                perspective: 'Limpieza diaria. Buscar pH balanceado 5.5 para no alterar el manto ácido de la piel.'
            },
            'skincare-general': {
                strictness: 4, focus: 'Dermal-Safety', pro: 'Dermatólogo',
                perspective: 'Seguridad dermatológica general.'
            },

            // SUPLEMENTOS
            'protein': {
                strictness: 3, focus: 'Muscle-Recovery', pro: 'Médico Deportivo',
                perspective: 'Fuente de nitrógeno para reparación tisular. Verificar perfil de aminoácidos y pureza.'
            },
            'creatine': {
                strictness: 2, focus: 'Performance', pro: 'Médico Deportivo',
                perspective: 'El ergo-nutriente más estudiado. Seguro y efectivo para potencia y cognición.'
            },
            'vitamin': {
                strictness: 3, focus: 'Micronutrients', pro: 'Inmunólogo/Médico',
                perspective: 'Coadyuvante metabólico. Verificar biodisponibilidad de las formas químicas (ej: citrato vs óxido).'
            },
            'pre-workout': {
                strictness: 4, focus: 'CNS-Stimulation', pro: 'Cardiólogo',
                perspective: 'Estimulantes del sistema nervioso central. Vigilar tolerancia cardíaca y calidad del descanso.'
            },
            'supplement-general': {
                strictness: 3, focus: 'Supplementation', pro: 'Nutricionista',
                perspective: 'Apoyo nutricional específico.'
            },

            // OTROS
            'medicamento': {
                strictness: 5, focus: 'Pharma-Safety', pro: 'Médico Tratante',
                perspective: 'Fármaco activo. Seguir estrictamente la posología e indicaciones médicas.'
            },
            'general': {
                strictness: 3, focus: 'General-Wellness', pro: 'Profesional de la Salud',
                perspective: 'Análisis estándar de seguridad y composición.'
            }
        };

        return rules[subCategory] || rules['general'];
    }

    async generateLLMAnalysis(product) {
        if (!product) return null;

        const ingredients = product.details?.ingredients || product.ingredients || []; // Fallback for diff structures
        const name = (product.name || '').toLowerCase();
        const category = product.category || 'general';
        const brand = product.brand || '';

        // --- STEP 1: CHECK VERIFICATION ---
        const verifiedData = VerifiedService.checkVerification(brand, name);

        // 1. Detectar Sub-Categoría
        const subCategory = this.detectSubCategory(product.name || '', category, ingredients);

        // 2. Obtener Reglas
        const rules = this.getCategoryRules(subCategory);
        const { strictness, focus, perspective, pro } = rules;

        // 3. Análisis de Procesamiento / Tóxicos
        // Separamos las listas para evitar falsos positivos (ej: 'sal' en shampoo vs comida)
        const foodBlacklist = [
            'azúcar', 'sugar', 'jarabe', 'syrup', 'fructosa', 'fructose', 'goma', 'gum',
            'maltodextrina', 'maltodextrin', 'colorante', 'dye', 'e1', 'e2', 'nitrito', 'nitrite',
            'glutamato', 'msg', 'aspartamo', 'aspartame', 'sucralosa', 'sucralose', 'acesulfamo', 'acesulfame',
            'aceite de palma', 'palm oil', 'grasas trans', 'trans fat', 'sodium', 'sodio',
            'bha', 'bht', 'tbhq', 'dioxide', 'dióxido', 'titanium', 'titanio', 'e171', 'e133', 'e129', 'e102'
        ];

        const beautyBlacklist = [
            'sulfato', 'sulfate', 'parabeno', 'paraben', 'silicona', 'silicone', 'dimethicone',
            'petrolatum', 'parafina', 'paraffin', 'peg-', 'bht', 'bha', 'triclosan',
            'formaldehido', 'formaldehyde', 'ftalato', 'phthalate', 'alcohol denat', 'benzyl alcohol',
            'fragancia', 'fragrance', 'parfum'
        ];

        const targetList = (category === 'alimento' || category === 'bebida' || category === 'suplemento' || subCategory.includes('snack') || subCategory === 'soda')
            ? foodBlacklist
            : beautyBlacklist;

        const processedItems = ingredients.filter(i =>
            targetList.some(p => i.toLowerCase().includes(p))
        );

        const sections = [];
        const facts = [];

        // Section: Processing / Purity (Updated Logic)
        const isClean = processedItems.length === 0;
        const isWorrying = processedItems.length > 1; // Más estricto: > 1 ya es alerta

        let purityTitle = 'Pureza de Fórmula';
        if (category === 'alimento') purityTitle = 'Nivel de Procesamiento';

        // --- OVERRIDE FOR VERIFIED PRODUCTS ---
        if (verifiedData) {
            sections.push({
                title: VerifiedService.getVerifiedMessage(verifiedData).title,
                icon: 'shield', // Use 'shield' instead of 'shield-check' if check-circle is not available, or ensure valid icon name
                type: 'success',
                content: VerifiedService.getVerifiedMessage(verifiedData).message
            });
        }

        sections.push({
            title: purityTitle,
            icon: isClean ? 'check-circle' : 'alert-triangle', // Icono cambia si hay tóxicos
            type: strictness >= 4 && isWorrying && !verifiedData ? 'bad' : (isClean ? 'success' : 'warning'), // Added 'bad'type handling in UI if needed, or stick to warning
            content: isClean
                ? 'Fórmula limpia sin los aditivos/tóxicos más comunes monitoreados.'
                : `Detectados ${processedItems.length} componente${processedItems.length > 1 ? 's' : ''} de atención: ${processedItems.slice(0, 3).map(i => i.split(' ')[0]).join(', ')}... ${strictness >= 4 ? 'No cumple con los estándares de ' + focus + '.' : 'Aceptable bajo uso moderado.'}`
        });

        // Section: Perspective (Logic remains similar but influenced by purity)
        sections.push({
            title: `Análisis: ${focus.replace(/-/g, ' ')}`,
            icon: 'activity',
            type: 'info',
            content: perspective
        });

        // Facts Generation
        if (verifiedData) facts.push({ label: 'SaludApp Verified', value: 'SÍ' });
        if (isClean) facts.push({ label: 'Clean Label', value: 'Sí' });
        else facts.push({ label: 'Aditivos Críticos', value: `${processedItems.length} Detectados` });

        if (strictness >= 5) facts.push({ label: 'Exigencia', value: 'Máxima' });

        facts.push({ label: 'Categoría', value: subCategory.toUpperCase() });

        // Verdict Logic Update
        // Verdict Logic Update
        const isBeautyToxic = (category === 'higiene' || category === 'cosmetico') && processedItems.length > 0;

        // For highly processed foods (strictness >= 4), tolerance is very low (> 1 item is bad).
        // For general foods, allow a bit more but cap at 3.
        const isFoodHeavilyProcessed = (category === 'alimento' || category === 'bebida') &&
            ((strictness >= 4 && processedItems.length > 1) || processedItems.length > 3);

        const isBad = !verifiedData && (isBeautyToxic || isFoodHeavilyProcessed);

        // --- GET ALTERNATIVES IF BAD ---
        let alternatives = [];
        if (isBad || (processedItems.length > 0 && !verifiedData)) {
            alternatives = VerifiedService.getAlternatives(category, subCategory);
        }

        // --- GENERATE HUMAN EXPLANATION ---
        let humanExplanation = "";
        if (verifiedData) {
            humanExplanation = "Este producto está verificado por SaludApp. Es una excelente opción porque cumple con nuestros estándares de transparencia y seguridad. No contiene ingredientes que consideremos de riesgo para esta categoría.";
        } else if (isBad) {
            const badIngredients = processedItems.slice(0, 3).map(i => i.split(' ')[0]).join(', ');
            humanExplanation = `No recomendamos este producto porque detectamos ingredientes procesados o aditivos que pueden ser perjudiciales en exceso, como ${badIngredients}. Existen alternativas más limpias y seguras.`;
        } else if (isClean) {
            humanExplanation = "Recomendamos este producto. Su fórmula es limpia y no contiene los aditivos más comunes que solemos evitar. Es una opción segura para el uso diario.";
        } else {
            humanExplanation = "Este producto es aceptable. Contiene algunos ingredientes procesados, pero en cantidades que consideramos seguras para un uso moderado. No es la opción más pura, pero cumple su función.";
        }

        return {
            title: `Diagnóstico: ${product.name}`,
            category: subCategory,
            focus,
            strictness,
            sections,
            facts,
            humanExplanation,
            professionalAdvice: {
                specialist: pro,
                message: `Este diagnóstico se basa en la categoría '${subCategory}'. Consulta con un ${pro} para una evaluación personalizada.`
            },
            verdict: {
                label: verifiedData ? 'VERIFICADO' : (isBad ? 'REVISIÓN RECOMENDADA' : 'ACEPTABLE'),
                status: verifiedData ? 'verified' : (isBad ? 'bad' : 'regular')
            },
            isVerified: !!verifiedData,
            alternatives: alternatives,
            criticalIngredients: processedItems, // Expose the raw list
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Determines the safety status of a single ingredient
     * @param {string} ingredientName 
     * @param {string} category 
     * @returns {string} 'good' | 'bad' | 'neutral'
     */
    getIngredientStatus(ingredientName, category) {
        if (!ingredientName) return 'neutral';
        const name = ingredientName.toLowerCase();

        // 1. Check Toxic/Processed Blacklists (Priority: Bad)
        const foodBlacklist = [
            'azúcar', 'sugar', 'jarabe', 'syrup', 'fructosa', 'fructose', 'goma', 'gum',
            'maltodextrina', 'maltodextrin', 'colorante', 'dye', 'e1', 'e2', 'nitrito', 'nitrite',
            'glutamato', 'msg', 'aspartamo', 'aspartame', 'sucralosa', 'sucralose', 'acesulfamo', 'acesulfame',
            'aceite de palma', 'palm oil', 'grasas trans', 'trans fat', 'sodium', 'sodio'
        ];

        const beautyBlacklist = [
            'sulfato', 'sulfate', 'parabeno', 'paraben', 'silicona', 'silicone', 'dimethicone',
            'petrolatum', 'parafina', 'paraffin', 'peg-', 'bht', 'bha', 'triclosan',
            'formaldehido', 'formaldehyde', 'ftalato', 'phthalate', 'alcohol denat', 'benzyl alcohol',
            'fragancia', 'fragrance', 'parfum', 'aluminum', 'aluminio', 'talc', 'talco'
        ];

        const isFood = (category === 'alimento' || category === 'bebida' || category === 'suplemento');
        const blacklist = isFood ? foodBlacklist : beautyBlacklist;

        if (blacklist.some(bad => name.includes(bad))) return 'bad';

        // 2. Check Positive Database (Priority: Good)
        const goodFood = ['avena', 'quinoa', 'chia', 'almendra', 'proteina', 'protein', 'fruta', 'fibra', 'stevia', 'eritritol', 'agua', 'water', 'cocoa', 'cacao'];
        const goodBeauty = ['aloe', 'hialuronico', 'hyaluronic', 'glicerina', 'glycerin', 'pantenol', 'panthenol', 'niacinamida', 'ceramida', 'zinc', 'karite', 'shea', 'jojoba'];

        const goodList = isFood ? goodFood : goodBeauty;

        if (goodList.some(good => name.includes(good))) return 'good';

        return 'neutral';
    }
    /**
     * AI-Powered Wiki Term Predictor
     * Uses NLP patterns to resolve complex cosmetic/chemical names to their most likely Wikipedia handle.
     */
    async predictWikiTerm(rawName) {
        if (!rawName) return null;
        const normalized = rawName.toLowerCase().trim();

        // 1. Core Pattern Matching (Simulating NLP Intent Classification)
        const knowledgeMap = {
            // Emulsifiers / Surfactants
            'steareth': 'Polietilenglicol', // Generalized intent
            'peg-': 'Polietilenglicol',
            'cetearyl': 'Alcohol_ceitoestearílico',
            'laureth': 'Lauril_sulfato_de_sodio', // Approximation for common surfactant search
            'sulfate': 'Sulfato',

            // Common Chemicals
            'glycerin': 'Glicerol',
            'aqua': 'Agua',
            'water': 'Agua',
            'parfum': 'Perfume',
            'fragrance': 'Perfume',
            'alcohol denat': 'Etanol',
            'alcohol': 'Etanol',
            'dimethicone': 'Dimeticona',
            'niacinamide': 'Nicotinamida',
            'panthenol': 'Pantenol',
            'salicylic': 'Ácido_salicílico',
            'hyaluronic': 'Ácido_hialurónico',
            'retinol': 'Retinol',
            'tocopherol': 'Tocoferol',
            'citric': 'Ácido_cítrico',
            'benzoate': 'Benzoato_de_sodio',
            'phenoxyethanol': 'Fenoxietanol',
            'kaolin': 'Caolinita',
            'zinc': 'Óxido_de_zinc',
            'titanium': 'Dióxido_de_titanio',
            'mica': 'Mica',
            'caffeine': 'Cafeína',
            'urea': 'Urea',
            'aloe': 'Aloe_vera',
            'disteardimonium': 'Hectorita',
            'hectorite': 'Hectorita',

            // Acids
            'citric acid': 'Ácido_cítrico',
            'glycolic acid': 'Ácido_glicólico',
            'lactic acid': 'Ácido_láctico',
            'salicylic acid': 'Ácido_salicílico',
            'hyaluronic acid': 'Ácido_hialurónico',
            'ascorbic acid': 'Ácido_ascórbico',
            'stearic acid': 'Ácido_esteárico',
            'palmitic acid': 'Ácido_palmítico',

            // Vitamins & Derivatives
            'niacinamide': 'Nicotinamida',
            'retinol': 'Retinol',
            'tocopherol': 'Tocoferol',
            'panthenol': 'Pantenol',
            'biotin': 'Biotina',
            'ascorbyl': 'Vitamina_C',

            // Oils & Butters
            'butyrospermum parkii': 'Manteca_de_karité',
            'shea butter': 'Manteca_de_karité',
            'simmondsia chinensis': 'Jojoba',
            'jojoba': 'Jojoba',
            'cocos nucifera': 'Aceite_de_coco',
            'coconut': 'Aceite_de_coco',
            'argan': 'Argania_spinosa',
            'tea tree': 'Melaleuca_alternifolia',

            // Minerals & Salts
            'sodium chloride': 'Cloruro_de_sodio',
            'sodium fluoride': 'Fluoruro_de_sodio',
            'zinc oxide': 'Óxido_de_zinc',
            'titanium dioxide': 'Dióxido_de_titanio',
            'magnesium sulfate': 'Sulfato_de_magnesio',
            'aluminum chlorohydrate': 'Clorhidrato_de_aluminio',

            // Common Compounds
            'glycerin': 'Glicerol',
            'propylene glycol': 'Propilenglicol',
            'butylene glycol': 'Butilenglicol',
            'sorbitol': 'Sorbitol',
            'xylitol': 'Xilitol',
            'allantoin': 'Alantoína',
            'bisabolol': 'Bisabolol',
            'ceramide': 'Ceramida',
            'cholesterol': 'Colesterol',
            'collagen': 'Colágeno',
            'elastin': 'Elastina',
            'keratin': 'Queratina',

            // Fragrance Allergens (Crucial for avoiding geography/people matches)
            'coumarin': 'Cumarina',
            'limonene': 'Limoneno',
            'linalool': 'Linalool',
            'citronellol': 'Citronelol',
            'geraniol': 'Geraniol',
            'farnesol': 'Farnesol',
            'eugenol': 'Eugenol',
            'isoeugenol': 'Isoeugenol',
            'benzyl alcohol': 'Alcohol_bencílico',
            'benzyl salicylate': 'Salicilato_de_bencilo',

            // Common Partial Matches / Abbreviations
            'hexyl': 'Hexil_cinamal', // Most common cosmetic context for "Hexyl"
            'cinnamal': 'Cinamal',
            'citral': 'Citral'
        };

        // 2. Intent Check: Does valid key exist in raw string?
        for (const [key, value] of Object.entries(knowledgeMap)) {
            if (normalized.includes(key)) {
                return value;
            }
        }

        // 3. Fallback: Heuristic capitalization for direct matches
        // E.g., "Maltodextrina" -> "Maltodextrina"
        return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    }
}

export default new AIService();
