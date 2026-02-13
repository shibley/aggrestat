import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const keywordId = searchParams.get('keyword_id');
  const source = searchParams.get('source');
  const sentiment = searchParams.get('sentiment');
  const minRelevance = searchParams.get('min_relevance');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('mentions')
    .select('*, keywords(keyword)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (keywordId) query = query.eq('keyword_id', keywordId);
  if (source) query = query.eq('source', source);
  if (sentiment) query = query.eq('sentiment', sentiment);
  if (minRelevance) query = query.gte('relevance_score', parseInt(minRelevance));

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count, limit, offset });
}
