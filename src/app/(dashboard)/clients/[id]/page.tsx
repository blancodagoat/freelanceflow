import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ClientForm from '@/components/ClientForm';
import Link from 'next/link';

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!client) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Edit client</h1>
        <Link href="/clients" className="text-sm text-neutral-600 hover:underline">
          Back to clients
        </Link>
      </div>
      <ClientForm client={client} />
    </div>
  );
}
