import ClientDetail from "@/components/admin/clients/ClientDetail";

export default async function AdminClientDetailPage({ params }) {
  const { id } = await params;
  return <ClientDetail clientId={id} />;
}
