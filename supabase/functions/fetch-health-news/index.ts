import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const newsApiKey = Deno.env.get('NEWSAPI_KEY');
    
    if (!newsApiKey) {
      throw new Error('NewsAPI key not configured');
    }

    console.log('Fetching health news from NewsAPI');

    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=health+fitness+workout&sortBy=publishedAt&language=en&pageSize=20`,
      {
        headers: {
          'X-API-Key': newsApiKey,
        },
      }
    );

    if (!newsResponse.ok) {
      throw new Error(`NewsAPI error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    
    console.log(`Successfully fetched ${newsData.articles?.length || 0} health news articles`);

    return new Response(
      JSON.stringify({
        success: true,
        articles: newsData.articles || [],
        totalResults: newsData.totalResults || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching health news:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});