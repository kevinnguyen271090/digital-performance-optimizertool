import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { authenticator } from 'https://esm.sh/otplib@12.0.1'
import QRCode from 'https://esm.sh/qrcode@1.5.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (path) {
      case 'setup':
        return await handleSetup(supabase, user.id)
      case 'verify':
        return await handleVerify(req, supabase, user.id)
      case 'disable':
        return await handleDisable(supabase, user.id)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleSetup(supabase: any, userId: string) {
  try {
    // Generate secret
    const secret = authenticator.generateSecret()
    
    // Create QR code
    const otpauth = authenticator.keyuri(userId, 'Avenger Hub', secret)
    const qrCode = await QRCode.toDataURL(otpauth)
    
    // Store secret in database
    const { error: dbError } = await supabase
      .from('user_2fa')
      .upsert({
        user_id: userId,
        secret: secret,
        enabled: false,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({
        secret,
        qrCode,
        message: '2FA setup successful'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to setup 2FA' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleVerify(req: Request, supabase: any, userId: string) {
  try {
    const { token } = await req.json()
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's 2FA secret
    const { data: twoFactorData, error: fetchError } = await supabase
      .from('user_2fa')
      .select('secret, enabled')
      .eq('user_id', userId)
      .single()

    if (fetchError || !twoFactorData) {
      return new Response(
        JSON.stringify({ error: '2FA not set up' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: twoFactorData.secret
    })

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enable 2FA if not already enabled
    if (!twoFactorData.enabled) {
      const { error: updateError } = await supabase
        .from('user_2fa')
        .update({ enabled: true })
        .eq('user_id', userId)

      if (updateError) {
        throw updateError
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '2FA verified successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Verify error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to verify 2FA' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleDisable(supabase: any, userId: string) {
  try {
    const { error } = await supabase
      .from('user_2fa')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '2FA disabled successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Disable error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to disable 2FA' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
} 