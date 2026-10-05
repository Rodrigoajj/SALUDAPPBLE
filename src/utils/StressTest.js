import AIService from '../services/AIService';

const mockProducts = [
    // --- ALIMENTOS COMPLEJOS ---
    { name: "Galletas Oreo", category: "alimento", details: { ingredients: ["Harina de trigo", "Azúcar", "Aceite de palma", "Cacao", "Jarabe de maíz de alta fructosa", "Lecitina de soja", "Sal", "Vainillina"] } },
    { name: "Refresco Coca-Cola", category: "bebida", details: { ingredients: ["Agua carbonatada", "Azúcar", "Colorante caramelo IV", "Ácido fosfórico", "Saborizantes naturales", "Cafeína"] } },
    { name: "Cereal Froot Loops", category: "alimento", details: { ingredients: ["Maíz", "Trigo", "Avena", "Azúcar", "Aceite vegetal", "Sal", "Colorante Rojo 40", "Colorante Amarillo 5", "Colorante Azul 1", "BHT"] } },
    { name: "Sopa Instantánea Maruchan", category: "alimento", details: { ingredients: ["Harina de trigo enriched", "Aceite vegetal", "Sal", "Vegetales deshidratados", "Glutamato Monosódico", "Hidrolizado de proteína de soja", "Azúcar", "Especias", "Caramelo clase IV", "Dióxido de silicio"] } },
    { name: "Yogurt Yoplait Fresa", category: "alimento", details: { ingredients: ["Leche descremada pasteurizada", "Preparado de fruta", "Azúcar", "Fructosa", "Almidón modificado", "Ácido cítrico", "Saborizante artificial", "Sorbato de potasio", "Colorante rojo 40", "Cultivos lácticos"] } },
    { name: "Pan Blanco Bimbo", category: "alimento", details: { ingredients: ["Harina de trigo", "Jarabe de maíz de alta fructosa", "Levadura", "Aceite vegetal", "Sal", "Monoglicéridos", "Propionato de calcio", "Enzimas", "Datem"] } },
    { name: "Doritos Nacho", category: "alimento", details: { ingredients: ["Maíz", "Aceite vegetal", "Maltodextrina", "Sal", "Queso cheddar", "Suero de leche", "Glutamato monosódico", "Suero de mantequilla", "Queso romano", "Concentrado de proteína de suero", "Cebolla en polvo", "Harina de maíz", "Dextrosa", "Tomate en polvo", "Especias", "Colorantes (Amarillo 6, Amarillo 5, Rojo 40)", "Ácido láctico", "Ácido cítrico", "Azúcar", "Ajo en polvo"] } },
    { name: "Nutella", category: "alimento", details: { ingredients: ["Azúcar", "Aceite de palma", "Avellanas", "Cacao magro", "Leche desnatada en polvo", "Suero lácteo en polvo", "Emulgente: lecitinas (soja)", "Vainillina"] } },
    { name: "Margarina Primavera", category: "alimento", details: { ingredients: ["Agua", "Aceites vegetales comestibles hidrogenados y sin hidrogenar", "Sal yodatada", "Mono y diglicéridos", "Lecitina de soya", "Sorbato de potasio", "Ácido cítrico", "Saborizante artificial", "Vitamina A", "Vitamina D", "Colorante (bixina, curcumina)"] } },
    { name: "Jugo Del Valle Naranja", category: "bebida", details: { ingredients: ["Jugo de naranja de concentrado", "Azúcar", "Ácido cítrico", "Concentrado Del Valle Naranja", "Vitamina C"] } }, // Intentionally simpler but sugary

    // --- COSMÉTICOS Y HIGIENE ---
    { name: "Shampoo Head & Shoulders", category: "higiene", details: { ingredients: ["Agua", "Lauril sulfato de sodio", "Lauril éter sulfato de sodio", "Diestearato de glicol", "Carbonato de zinc", "Cloruro de sodio", "Xilenosulfonato de sodio", "Piritionato de zinc", "Cocamidopropil betaína", "Dimeticona", "Fragancia", "Benzoato de sodio", "Cloruro de guar hidroxipropiltrimonio", "Hidróxido de magnesio", "Metilicloroisotiazolinona", "Metilisotiazolinona", "Azul 1", "Rojo 33"] } },
    { name: "Desodorante Axe", category: "higiene", details: { ingredients: ["Alcohol Denat", "Butano", "Isobutano", "Propano", "Perfume", "Neodecanoato de Zinc", "Miristato de Isopropilo", "Cumarina", "Limoneno", "Linalol"] } },
    { name: "Crema Nivea Soft", category: "cosmetico", details: { ingredients: ["Aqua", "Glycerin", "Paraffinum Liquidum", "Myristyl Alcohol", "Butylene Glycol", "Alcohol Denat", "Stearic Acid", "Myristyl Myristate", "Cera Microcristallina", "Glyceryl Stearate", "Hydrogenated Coco-Glycerides", "Simmondsia Chinensis Seed Oil", "Tocopheryl Acetate", "Lanolin Alcohol (Eucerit®)", "Polyglyceryl-2 Caprate", "Dimethicone", "Sodium Carbomer", "Phenoxyethanol", "Linalool", "Citronellol", "Alpha-Isomethyl Ionone", "Butylphenyl Methylpropional", "Limonene", "Benzyl Alcohol", "Benzyl Salicylate", "Parfum"] } },
    { name: "Pasta Dental Colgate Total", category: "higiene", details: { ingredients: ["Glicerina", "Agua", "Sílice hidratada", "Laurilsulfato de sodio", "Arginina", "Aroma", "Goma de celulosa", "Óxido de zinc", "Poloxámero 407", "Citrato de zinc", "Pirofosfato tetrasódico", "Goma xantana", "Alcohol bencílico", "Cocamidopropil betaína", "Fluoruro de sodio", "Sacarina sódica", "Sucralosa", "CI 77891", "CI 74260"] } },
    { name: "Protector Solar Banana Boat", category: "higiene", details: { ingredients: ["Agua", "Octocrylene", "Benzophenone-3", "Butyl Methoxydibenzoylmethane", "Ethylhexyl Salicylate", "Propylene Glycol", "Phenonip", "Triethanolamine", "Carbomer", "Aloe Barbadensis Leaf Juice", "Tocopheryl Acetate", "Fragancia"] } },
    { name: "Labial Maybelline Superstay", category: "cosmetico", details: { ingredients: ["Dimethicone", "Trimethylsiloxysilicate", "Isododecane", "Nylon-611/Dimethicone Copolymer", "Dimethicone Crosspolymer", "C30-45 Alkyldimethylsilyl Polypropylsilsesquioxane", "Lauroyl Lysine", "Alumina", "Silica Silylate", "Phenoxyethanol", "Disodium Stearoyl Glutamate", "Aluminum Hydroxide", "Limonene", "Silica", "Synthetic Fluorphlogopite", "Paraffin", "Calcium Aluminum Borosilicate", "Polybutylene Terephthalate", "Benzyl Benzoate", "Caprylyl Glycol", "Calcium Sodium Borosilicate", "Acrylates Copolymer", "Ethylene/Va Copolymer", "Benzyl Alcohol", "Magnesium Silicate", "Citronellol", "Polyethylene Terephthalate", "Tin Oxide", "Parfum / Fragrance"] } },
    { name: "Jabón Dove", category: "higiene", details: { ingredients: ["Sodium Lauroyl Isethionate", "Stearic Acid", "Lauric Acid", "Sodium Tallowate", "Water", "Sodium Isethionate", "Sodium Stearate", "Cocamidopropyl Betaine", "Sodium Cocoate", "Dipropylene Glycol", "Sodium Chloride", "Tetrasodium Etidronate", "Tetrasodium EDTA", "Maltol", "Titanium Dioxide"] } },
    { name: "Loción Astringente Clean & Clear", category: "cosmetico", details: { ingredients: ["Salicylic Acid", "Water", "Alcohol Denat", "Glycerin", "Eucalyptus Globulus Leaf Oil", "Menthol", "Camphor", "Peppertmint Oil", "Sodium Citrate", "Fragrance", "Blue 1"] } },
    { name: "Rimel L'Oreal Voluminous", category: "cosmetico", details: { ingredients: ["Aqua / Water / Eau", "Paraffin", "Cyclopentasiloxane", "Cera Alba / Beeswax / Cire Dabeille", "Stearic Acid", "Triethanolamine", "Acacia / Acacia Senegal Gum", "Carnauba / Carnauba Wax / Cire De Carnauba", "Palmitic Acid", "Dimethiconol", "Hydroxyethylcellulose", "Panthenol", "Imidazolidinyl Urea", "Sodium Polymethacrylate", "Methylparaben", "Peg/Ppg-17/18 Dimethicone", "2-Oleamido-1,3-Octadecanediol", "Propylparaben", "Simethicone", "Bht", "Polyquaternium-10"] } },
    { name: "Toallitas Desmaquillantes Neutrogena", category: "cosmetico", details: { ingredients: ["Water", "Isononyl Isononanoate", "Pentaerythrityl Tetraethylhexanoate", "Cetyl Ethylhexanoate", "Isostearyl Palmitate", "Cyclopentasiloxane", "Hexylene Glycol", "PEG-6 Caprylic/Capric Glycerides", "Phenoxyethanol", "Sucrose Cocoate", "Carbomer", "PEG-4 Laurate", "Fragrance", "Sodium Hydroxide", "Benzoic Acid", "Dehydroacetic Acid", "Iodopropynyl Butylcarbamate", "Ethylhexylglycerin"] } },

    // --- SUPLEMENTOS ---
    { name: "Whey Protein Gold Standard", category: "suplemento", details: { ingredients: ["Protein Blend (Whey Protein Isolates, Whey Protein Concentrate, Whey Peptides)", "Cocoa", "Lecithin", "Natural and Artificial Flavors", "Acesulfame Potassium", "Aminogen", "Lactase"] } },
    { name: "Pre-Workout C4", category: "suplemento", details: { ingredients: ["Beta-Alanine", "Creatine Nitrate", "Arginine AKG", "Explosive Energy Blend (Caffeine Anhydrous, L-Tyrosine, TeaCor)", "Citric Acid", "Natural and Artificial Flavors", "Silicon Dioxide", "Calcium Silicate", "Sucralose", "Acesulfame Potassium", "FD&C Red Lake #40"] } },
    { name: "BCAA Xtend", category: "suplemento", details: { ingredients: ["L-Leucine", "L-Glutamine", "L-Isoleucine", "L-Valine", "Electrolyte Blend (Sodium Citrate, Potassium Chloride, Sodium Chloride)", "Citrulline Malate", "Citric Acid", "Natural and Artificial Flavors", "Sucralose", "Acesulfame Potassium", "FD&C Blue #1"] } },
    { name: "Creatina Monohidrato", category: "suplemento", details: { ingredients: ["Creatina Monohidrato Micronizada"] } },
    { name: "Quemador Lipo 6 Black", category: "suplemento", details: { ingredients: ["Caffeine Anhydrous", "Theobromine Anhydrous", "Advantra Z Citrus Aurantium", "Yohimbine HCl", "Rauwolscine", "Glycerin", "Vegetable Cellulose", "Purified Water", "Polysorbate 80", "Hypromellose", "FD&C Blue 1", "FD&C Red 40", "FD&C Yellow 6"] } },
    { name: "Multivitamínico Centrum", category: "suplemento", details: { ingredients: ["Calcium Carbonate", "Magnesium Oxide", "Potassium Chloride", "Dibasic Calcium Phosphate", "Microcrystalline Cellulose", "Ascorbic Acid (Vit. C)", "Ferrous Fumarate", "dl-Alpha Tocopheryl Acetate (Vit. E)", "Niacinamide", "Gelatin", "Crospovidone", "Zinc Oxide", "Calcium Pantothenate"] } },
    { name: "Colágeno Hidrolizado", category: "suplemento", details: { ingredients: ["Péptidos de Colágeno Hidrolizado Bovino", "Vitamina C", "Ácido Hialurónico", "Stevia"] } },
    { name: "Barra de Proteína Quest", category: "suplemento", details: { ingredients: ["Protein Blend (Milk Protein Isolate, Whey Protein Isolate)", "Soluble Corn Fiber", "Almonds", "Water", "Erythritol", "Cocoa Butter", "Natural Flavors", "Cocoa Processed with Alkali", "Sea Salt", "Steviol Glycosides (Stevia)", "Sucralose"] } },
    { name: "Mass Gainer Serious Mass", category: "suplemento", details: { ingredients: ["Maltodextrin", "Protein Blend (Whey Protein Concentrate, Calcium Caseinate, Egg Albumen, Sweet Dairy Whey)", "Natural and Artificial Flavors", "Vitamin and Mineral Blend", "Lecithin", "Acesulfame Potassium", "Medium Chain Triglycerides"] } },
    { name: "Omega 3 Fish Oil", category: "suplemento", details: { ingredients: ["Fish Oil Concentrate", "Gelatin", "Glycerin", "Water", "Mixed Natural Tocopherols"] } },

    // --- ALIMENTOS MÁS SANOS (Testing false positives) ---
    { name: "Avena Quaker", category: "alimento", details: { ingredients: ["Hojuelas de avena de grano entero"] } },
    { name: "Arroz Integral", category: "alimento", details: { ingredients: ["Arroz integral de grano largo"] } },
    { name: "Lentejas La Costeña", category: "alimento", details: { ingredients: ["Lentejas", "Agua", "Sal", "Aceite vegetal", "Cebolla", "Ajo"] } },
    { name: "Aceite de Oliva Extra Virgen", category: "alimento", details: { ingredients: ["Aceite de oliva virgen extra"] } },
    { name: "Atún en Agua", category: "alimento", details: { ingredients: ["Lomo de atún aleta amarilla", "Agua", "Sal yodatada"] } },

    // --- VERIFIED BRAND PRODUCTS (Should be auto-verified) ---
    { name: "Native Deodorant - Coconut & Vanilla", brand: "Native", category: "higiene", details: { ingredients: ["Caprylic/Capric Triglyceride", "Tapioca Starch", "Ozokerite", "Sodium Bicarbonate", "Magnesium Hydroxide", "Cocos Nucifera (Coconut) Oil", "Cyclodextrin", "Butyrospermum Parkii (Shea) Butter", "Fragrance", "Dextrose", "Lactobacillus Acidophilus"] } },
    { name: "Dr. Bronner's Pure-Castile Soap - Peppermint", brand: "Dr. Bronner's", category: "higiene", details: { ingredients: ["Water", "Organic Coconut Oil", "Potassium Hydroxide", "Organic Palm Kernel Oil", "Organic Olive Oil", "Mentha Arvensis", "Organic Hemp Oil", "Organic Jojoba Oil", "Mentha Piperita", "Citric Acid", "Tocopherol"] } },
    { name: "RXBAR Protein Bar - Chocolate Sea Salt", brand: "RXBAR", category: "alimento", details: { ingredients: ["Dates", "Egg Whites", "Almonds", "Cashews", "Chocolate", "Cocoa", "Natural Flavors", "Sea Salt"] } },
    { name: "Primal Kitchen Mayo", brand: "Primal Kitchen", category: "alimento", details: { ingredients: ["Avocado Oil", "Organic Eggs", "Organic Egg Yolks", "Organic Vinegar", "Sea Salt", "Organic Rosemary Extract"] } },

    // --- EDGES CASES ---
    { name: "Producto Vacío", category: "general", details: { ingredients: [] } },
    { name: "Producto Sin Categoría", details: { ingredients: ["Azúcar", "Agua"] } },
    { name: null, category: "alimento", details: { ingredients: ["Harina"] } },

    // FILLER TO REACH ~50 (Variations)
    { name: "Galletas Chocolate Genéricas", category: "alimento", details: { ingredients: ["Harina", "Azúcar", "Grasa vegetal", "Cacao", "Leudantes", "Saborizante"] } },
    { name: "Jugo Manzana", category: "bebida", details: { ingredients: ["Jugo concentrado", "Azúcar", "Ácido málico"] } },
    { name: "Crema Corporal Genérica", category: "cosmetico", details: { ingredients: ["Agua", "Petrolatum", "Glicerina", "Fragancia", "Metilparabeno"] } },
    { name: "Shampoo Anticaspa Genérico", category: "higiene", details: { ingredients: ["Agua", "Sulfato de sodio", "Piritionato de zinc", "Fragancia"] } },
    { name: "Proteína Vegana", category: "suplemento", details: { ingredients: ["Proteína de chícharo", "Proteína de arroz", "Sabor vainilla", "Stevia"] } },
    { name: "Barra Energética Genérica", category: "alimento", details: { ingredients: ["Avena", "Miel", "Cacahuate", "Chispas de chocolate"] } },
    { name: "Salsa de Tomate", category: "alimento", details: { ingredients: ["Tomate", "Sal", "Especias", "Ácido cítrico"] } },
    { name: "Refresco Lima-Limón", category: "bebida", details: { ingredients: ["Agua carbonatada", "Azúcar", "Saborizante natural", "Benzoato de sodio"] } }
];

export const runStressTest = async () => {
    console.log(`\n🚀 INICIANDO PRUEBA DE ESTRÉS DE IA (${mockProducts.length} productos)...`);
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;
    let verifiedCount = 0;
    let badVerdictCount = 0;
    const errors = [];

    // Process in batches to avoid locking the UI thread too much if run there
    for (let i = 0; i < mockProducts.length; i++) {
        const product = mockProducts[i];
        try {
            const startProd = Date.now();
            const result = await AIService.generateLLMAnalysis(product);
            const duration = Date.now() - startProd;

            if (result && result.sections && result.verdict) {
                successCount++;
                if (result.isVerified) verifiedCount++;
                if (result.verdict.status === 'bad') badVerdictCount++;

                // Logging specific interesting cases
                if (duration > 100) console.warn(`⚠️ Slow analysis for ${product.name || 'Unknown'}: ${duration}ms`);
            } else {
                throw new Error("Invalid result structure");
            }
        } catch (error) {
            failureCount++;
            errors.push({ name: product.name, error: error.message });
            console.error(`❌ Error scanning ${product.name}:`, error);
        }

        // Progress every 10
        if ((i + 1) % 10 === 0) console.log(`... ${i + 1}/${mockProducts.length} procesados`);
    }

    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / mockProducts.length;

    console.log(`\n📊 REPORTE FINAL DE ESTRÉS`);
    console.log(`=============================`);
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Fallidos: ${failureCount}`);
    console.log(`🛡️ Verificados detectados: ${verifiedCount}`);
    console.log(`⚠️ Veredictos 'Bad': ${badVerdictCount}`);
    console.log(`⏱️ Tiempo Total: ${totalTime}ms`);
    console.log(`⏱️ Promedio por producto: ${avgTime.toFixed(2)}ms`);

    if (errors.length > 0) {
        console.log(`\n🚨 DETALLE DE ERRORES:`);
        errors.forEach(e => console.log(`- ${e.name}: ${e.error}`));
    }

    return {
        successCount,
        failureCount,
        totalTime,
        avgTime,
        verifiedCount
    };
};

export default { runStressTest };
