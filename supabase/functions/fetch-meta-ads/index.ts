import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch connections that need sync
    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('platform', 'meta')
      .eq('service', 'ads')
      .eq('status', 'connected');

    if (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }

    if (!connections || connections.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No Meta Ads connections found' }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let processedCount = 0;
    const errors = [];

    for (const connection of connections) {
      try {
        // Fetch Meta Ads data
        const adsData = await fetchMetaAdsData(connection);
        
        // Store in analytics_data table
        const { error: insertError } = await supabase
          .from('analytics_data')
          .insert({
            organization_id: connection.organization_id,
            platform: 'meta',
            service: 'ads',
            metrics: adsData,
            dimensions: { 
              adAccountId: connection.metadata?.adAccountId,
              campaignId: connection.metadata?.campaignId 
            }
          });

        if (insertError) {
          console.error('Error inserting ads data:', insertError);
          errors.push({
            connectionId: connection.id,
            error: insertError.message
          });
          continue;
        }

        // Update last_sync timestamp
        await supabase
          .from('connections')
          .update({ last_sync: new Date().toISOString() })
          .eq('id', connection.id);

        processedCount++;

      } catch (connectionError) {
        console.error(`Error processing connection ${connection.id}:`, connectionError);
        errors.push({
          connectionId: connection.id,
          error: connectionError.message
        });
      }
    }

    // Log results
    await supabase
      .from('audit_logs')
      .insert({
        action: 'meta_ads_sync',
        resource: 'analytics_data',
        details: {
          processedCount,
          errorCount: errors.length,
          errors
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        processedCount, 
        errorCount: errors.length,
        errors 
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    // Log error
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      
      await supabase
        .from('error_logs')
        .insert({
          platform: 'meta',
          error_message: error.message,
          details: { stack: error.stack }
        });
    } catch (logError) {
      console.error('Error logging failed:', logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function fetchMetaAdsData(connection: any) {
  // TODO: Implement actual Meta Ads API call
  // For now, return mock data
  const credentials = connection.credentials;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 2000) + 500,
    spend: Math.floor(Math.random() * 5000) + 1000,
    ctr: Math.random() * 0.1 + 0.01,
    cpc: Math.random() * 5 + 1,
    conversions: Math.floor(Math.random() * 100) + 20,
    conversionRate: Math.random() * 0.05 + 0.01
  };
} 