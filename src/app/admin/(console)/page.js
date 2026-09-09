import Link from "next/link";
import { adminCards } from "@/data/adminNav";
import { getNewInquiryCount } from "@/lib/clients/getNewInquiryCount";

export default async function AdminDashboardPage() {
  const newInquiries = await getNewInquiryCount();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Golden Spoon Admin
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Manage website content, menus, gallery and inquiries.
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminCards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block h-full rounded-lg border border-neutral-200 bg-white px-5 py-5 transition-colors hover:border-[#B5935A]/50"
            >
              <h2 className="text-base font-semibold text-neutral-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{card.copy}</p>
              {card.href === "/admin/clients" && typeof newInquiries === "number" ? (
                <p className="mt-3 text-xs font-medium tracking-[0.12em] text-[#8a6d3c] uppercase">
                  {newInquiries === 1 ? "1 new inquiry" : `${newInquiries} new inquiries`}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
