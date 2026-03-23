
/**
 * WikiService.js
 * Service responsible for fetching verified definitions from Wikipedia
 * corresponding to the user's specific ingredient request.
 */
import AIService from './AIService';

class WikiService {

    /**
     * Main function to get external details
     * 1. Uses "AI" (Heuristics/Simulated) to normalize the name to a Wiki-compatible term.
     * 2. Fetches the summary from Wikipedia API.
     */
    async getIngredientDescription(rawName) {
        if (!rawName) return null;

        try {
            // Step 1: "AI" Analysis of intent/entity
            // We delegate this to AIService to simulate the NLP part
            const wikiTerm = await AIService.predictWikiTerm(rawName);
            console.log(`[WikiService] Term resolved: '${rawName}' -> '${wikiTerm}'`);

            if (!wikiTerm) return null;

            // Step 2: Fetch from Wikipedia (Direct Summary)
            let finalTerm = wikiTerm;
            let response = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(finalTerm)}`);
            let data = response.ok ? await response.json() : null;

            // Check if valid match (standard page, not disambiguation, and has content)
            let isValid = data && data.type !== 'disambiguation' && (data.extract || data.description);

            // Semantic Validation Helper
            const isSemanticallyValid = (text) => {
                const intro = (text || "").toLowerCase().substring(0, 150);
                const RED_FLAGS = [
                    'comuna', 'localidad', 'municipio', 'distrito', 'provincia', 'departamento', 'pueblo', 'ciudad', 'capital', // Geography
                    'futbolista', 'actriz', 'actor', 'cantante', 'músico', 'banda', 'álbum', 'canción', // People/Art
                    'película', 'serie', 'videojuego', 'novela',
                    'película', 'serie', 'videojuego', 'novela',
                    'río', 'lago', 'montaña', 'isla', 'archipiélago', 'apellido', 'santo', 'santa',
                    // Biological False Positives (Taxonomy) - "Tribu" often catches random Latin names
                    'tribu', 'subtribu', 'orquídea', 'orquidáceas', 'polilla', 'escarabajo', 'mariposa', 'reptil'
                ];
                // Green flags (optional for future)
                return !RED_FLAGS.some(flag => intro.includes(` ${flag} `) || intro.startsWith(flag) || intro.includes(` ${flag},`));
            };

            // Validate First Result
            if (isValid && !isSemanticallyValid(data.extract || data.description)) {
                console.warn(`[WikiService] Semantic Reject (1): '${data.title}'`);
                isValid = false;
            }

            // Step 3: Fallback - If invalid, use OpenSearch
            if (!isValid) {
                console.log(`[WikiService] Falling back to OpenSearch for '${rawName}'...`);
                const searchResponse = await fetch(`https://es.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(rawName)}&limit=3&namespace=0&format=json&origin=*`);
                const searchData = await searchResponse.json();

                // OpenSearch returns: [search_term, [titles], [descriptions], [urls]]
                if (searchData[1] && searchData[1].length > 0) {
                    // Iterate through results to find the first valid one
                    let foundValid = false;
                    for (let i = 0; i < searchData[1].length; i++) {
                        const searchTitle = searchData[1][i];
                        console.log(`[WikiService] Checking OpenSearch result ${i}: '${searchTitle}'`);

                        const subResponse = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTitle)}`);
                        if (subResponse.ok) {
                            const subData = await subResponse.json();
                            // Validate this candidate
                            if (subData.type !== 'disambiguation' && isSemanticallyValid(subData.extract || subData.description)) {
                                data = subData;
                                isValid = true;
                                finalTerm = searchTitle;
                                console.log(`[WikiService] Semantic Match Found: '${searchTitle}'`);
                                foundValid = true;
                                break;
                            } else {
                                console.log(`[WikiService] Rejected candidate '${searchTitle}'`);
                            }
                        }
                    }
                    if (!foundValid) data = null;
                } else {
                    data = null;
                }
            }

            if (!data || !isValid) return null;

            // Validation: Ensure we have a meaningful description
            let description = data.extract;
            if (!description || description.length < 20) {
                description = data.description; // Fallback to short description
            }
            // If still no description or it's a disambiguation page (often empty extract)
            if (!description || description.length < 5 || data.type === 'disambiguation') {
                console.warn(`[WikiService] Page '${data.title}' has insufficient content.`);
                return null;
            }

            // Ensure image URL has protocol
            let imageUrl = data.thumbnail?.source;
            if (imageUrl && imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            }
            // Filter out SVGs which React Native Image often struggles with
            if (imageUrl && imageUrl.toLowerCase().endsWith('.svg')) {
                imageUrl = null;
            }

            // Return standardized object
            return {
                description: description,
                source: 'Wikipedia',
                pageUrl: data.content_urls?.mobile?.page || data.content_urls?.desktop?.page,
                image: imageUrl,
                title: data.title
            };

        } catch (error) {
            console.error('[WikiService] Error fetching data:', error);
            return null;
        }
    }
}

export default new WikiService();
