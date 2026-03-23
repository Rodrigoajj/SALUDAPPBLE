/**
 * VerifiedService - Manages "SaludApp Verified" products and recommendations
 * This mocks a backend database of paid/vetted clean brands.
 */

class VerifiedService {
    constructor() {
        // In a real app, this would come from a remote database/API
        this.verifiedDatabase = [
            {
                id: "verified_001",
                name: "Native Deodorant - Coconut & Vanilla",
                brand: "Native",
                category: "higiene",
                subCategory: "deodorant",
                image_url: "https://m.media-amazon.com/images/I/61S2G+8D3+L._SL1500_.jpg",
                badges: ["clean_label", "aluminum_free"],
                score: 5,
                tags: ["Sin Aluminio", "Natural"]
            },
            {
                id: "verified_002",
                name: "Dr. Bronner's Pure-Castile Soap - Peppermint",
                brand: "Dr. Bronner's",
                category: "higiene",
                subCategory: "body-wash",
                image_url: "https://images.openfoodfacts.org/images/products/001/878/776/1655/front_en.13.400.jpg",
                badges: ["organic", "fair_trade", "vegan"],
                score: 5,
                tags: ["Biodegradable", "Multiuso"]
            },
            {
                id: "verified_003",
                name: "RXBAR Protein Bar - Chocolate Sea Salt",
                brand: "RXBAR",
                category: "alimento",
                subCategory: "snack-sweet",
                image_url: "https://images.openfoodfacts.org/images/products/085/777/700/4232/front_en.3.400.jpg",
                badges: ["clean_ingredients", "no_added_sugar"],
                score: 5,
                tags: ["Proteína Real", "Sin Gluten"]
            },
            {
                id: "verified_004",
                name: "Optimum Nutrition Gold Standard Whey",
                brand: "Optimum Nutrition",
                category: "suplemento",
                subCategory: "protein",
                image_url: "https://images.openfoodfacts.org/images/products/506/046/998/2813/front_en.3.400.jpg",
                badges: ["bestseller", "lab_tested"],
                score: 5,
                tags: ["Alta Pureza", "Isolada"]
            },
            {
                id: "verified_005",
                name: "CeraVe Hydrating Facial Cleanser",
                brand: "CeraVe",
                category: "higiene",
                subCategory: "skincare-face",
                image_url: "https://images.openfoodfacts.org/images/products/333/787/559/7180/front_fr.4.400.jpg",
                badges: ["dermatologist_tested", "fragrance_free"],
                score: 5,
                tags: ["Sin Fragancia", "Ceramidas"]
            },
            {
                id: "verified_006",
                name: "La Roche-Posay Anthelios 50+",
                brand: "La Roche-Posay",
                category: "higiene",
                subCategory: "sun-care",
                image_url: "https://images.openfoodfacts.org/images/products/333/787/554/6409/front_fr.24.400.jpg",
                badges: ["dermatologist_tested", "broad_spectrum"],
                score: 5,
                tags: ["Protección Alta", "No Comedogénico"]
            },
            // NEW PRODUCTS FOR RECOMMENDATIONS
            {
                id: "verified_007",
                name: "Shea Moisture Shampoo - Coconut & Hibiscus",
                brand: "Shea Moisture",
                category: "higiene",
                subCategory: "hair-care",
                image_url: "https://images.openfoodfacts.org/images/products/076/430/229/0039/front_en.6.400.jpg",
                badges: ["sulfate_free", "paraben_free"],
                score: 5,
                tags: ["Sin Sulfatos", "Rizos Definidos"]
            },
            {
                id: "verified_008",
                name: "The Honest Company Shampoo + Body Wash",
                brand: "The Honest Company",
                category: "higiene",
                subCategory: "hair-care",
                image_url: "https://images.openfoodfacts.org/images/products/081/781/001/4579/front_en.4.400.jpg",
                badges: ["tear_free", "hypoallergenic"],
                score: 5,
                tags: ["Hipoalergénico", "Suave"]
            },
            {
                id: "verified_009",
                name: "Hu Kitchen Dark Chocolate",
                brand: "Hu",
                category: "alimento",
                subCategory: "snack-sweet",
                image_url: "https://images.openfoodfacts.org/images/products/085/018/000/6065/front_en.10.400.jpg",
                badges: ["vegan", "paleo"],
                score: 5,
                tags: ["Sin Refinar", "Orgánico"]
            },
            {
                id: "verified_010",
                name: "Primal Kitchen Mayo with Avocado Oil",
                brand: "Primal Kitchen",
                category: "alimento",
                subCategory: "sauce",
                image_url: "https://images.openfoodfacts.org/images/products/085/523/200/5063/front_en.14.400.jpg",
                badges: ["whole30", "keto"],
                score: 5,
                tags: ["Aceite de Aguacate", "Sin Azúcar"]
            }
        ];
    }

    /**
     * Checks if a product is verified based on brand or exact ID
     * @param {string} brand 
     * @param {string} name 
     * @returns {Object|null} The verified product metadata or null
     */
    checkVerification(brand, name) {
        if (!brand) return null;
        const normalizedBrand = brand.toLowerCase();

        // Simple fuzzy match for mock purposes
        return this.verifiedDatabase.find(p =>
            p.brand.toLowerCase() === normalizedBrand ||
            (name && name.toLowerCase().includes(p.brand.toLowerCase()))
        ) || null;
    }

    /**
     * Gets recommended alternatives for a specific category/subcategory
     * @param {string} category 
     * @param {string} subCategory 
     * @returns {Array} List of recommended products
     */
    getAlternatives(category, subCategory) {
        // 1. Try exact subcategory match
        let matches = this.verifiedDatabase.filter(p =>
            p.subCategory === subCategory
        );

        // 2. If no exact matches, try general category match
        if (matches.length === 0) {
            matches = this.verifiedDatabase.filter(p =>
                p.category === category
            );
        }

        // Return up to 3 recommendations
        return matches.slice(0, 3);
    }

    getAllVerified() {
        return this.verifiedDatabase;
    }

    /**
     * Gets a specific banner/message for a verified product
     * @param {Object} verifiedData 
     */
    getVerifiedMessage(verifiedData) {
        if (!verifiedData) return null;
        return {
            title: "SaludApp Verified",
            message: `Este producto de ${verifiedData.brand} cumple con nuestros estándares de seguridad y transparencia.`,
            icon: "shield-check"
        };
    }
}

export default new VerifiedService();
