import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PLAN_LIMITS } from '@/types';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { keyword } = await request.json();
  if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  // Check plan limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const { count } = await supabase
    .from('keywords')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const plan = (profile?.plan || 'free') as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[plan].keywords;

  if ((count || 0) >= limit) {
    return NextResponse.json(
      { error: `Keyword limit reached (${limit}). Upgrade your plan for more.` },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from('keywords')
    .insert({ user_id: user.id, keyword: keyword.trim().toLowerCase() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Keyword ID required' }, { status: 400 });

  const { error } = await supabase
    .from('keywords')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
