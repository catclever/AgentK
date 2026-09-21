export interface OpenAlexWork {
  id: string;
  title: string;
  display_name: string;
  publication_year: number;
  authorships: Array<{
    author: {
      id: string;
      display_name: string;
    };
  }>;
  cited_by_count: number;
  abstract_inverted_index?: Record<string, number[]>;
  primary_location?: {
    landing_page_url?: string;
    pdf_url?: string;
  };
}

export interface OpenAlexSearchResponse {
  meta: {
    count: number;
    page: number;
    per_page: number;
  };
  results: OpenAlexWork[];
}

const BASE_URL = 'https://api.openalex.org';

/**
 * Perform a basic text search for works (papers)
 */
export async function searchWorks(query: string, page: number = 1, perPage: number = 20): Promise<OpenAlexSearchResponse> {
  const url = new URL(`${BASE_URL}/works`);
  if (query) {
    url.searchParams.set('search', query);
  }
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per-page', perPage.toString());
  
  // Adding email parameter to get into the "polite pool" for faster/more reliable responses
  url.searchParams.set('mailto', 'agentk-demo@example.com'); 

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`OpenAlex API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch from OpenAlex:', error);
    throw error;
  }
}

/**
 * Reconstruct abstract from inverted index
 */
export function reconstructAbstract(invertedIndex?: Record<string, number[]>): string {
  if (!invertedIndex) return 'No abstract available.';
  
  let maxIndex = -1;
  const wordMap: Record<number, string> = {};
  
  for (const [word, indices] of Object.entries(invertedIndex)) {
    for (const idx of indices) {
      wordMap[idx] = word;
      if (idx > maxIndex) {
        maxIndex = idx;
      }
    }
  }
  
  const words: string[] = [];
  for (let i = 0; i <= maxIndex; i++) {
    words.push(wordMap[i] || '');
  }
  
  return words.join(' ').replace(/(\s+)([.,;:?!])/g, '$2').trim();
}
