import ClientForm from '@/components/ClientForm';

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Add client</h1>
      <ClientForm />
    </div>
  );
}
