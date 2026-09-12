import ClientDetail from "@/components/admin/clients/ClientDetail";

export default async function AdminClientDetailPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const paymentReturn =
    typeof query?.payment === "string" ? query.payment : null;
  return <ClientDetail clientId={id} paymentReturn={paymentReturn} />;
}
