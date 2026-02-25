import { getAddresses } from "@/actions/address-actions";
import AddressList from "../_components/address-list";

export default async function AddressesPage() {
  const addresses = await getAddresses();

  if (!addresses || "success" in addresses) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-red-600">Unable to load addresses. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-(--primary-color)/5 p-4 md:p-5">
        <h2 className="text-2xl font-bold text-(--primary-color)">Address Book</h2>
        <p className="text-sm text-(--muted-foreground) mt-1">
          Manage your shipping and billing addresses.
        </p>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  );
}
