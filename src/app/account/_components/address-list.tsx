"use client";

import { useState, useTransition } from "react";
import { addAddressAction, updateAddressAction, deleteAddressAction } from "@/actions/address-actions";
import { Plus, Pencil, Trash2, MapPin, X, Loader2, Save } from "lucide-react";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
}

interface AddressListProps {
  initialAddresses: Address[];
}

export default function AddressList({ initialAddresses }: AddressListProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAdd = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const data = {
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postalCode: formData.get("postalCode") as string,
        country: (formData.get("country") as string) || "Egypt",
      };

      const result = await addAddressAction(data);
      if (result && "success" in result) {
        setMessage({ text: result.message, success: result.success });
        if (result.success) {
          setShowForm(false);
          // Re-fetch handled by revalidatePath, but we can optimistically reload
          window.location.reload();
        }
      }
    });
  };

  const handleUpdate = (addressId: string, formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const data = {
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postalCode: formData.get("postalCode") as string,
        country: formData.get("country") as string,
      };

      const result = await updateAddressAction(addressId, data);
      if (result && "success" in result) {
        setMessage({ text: result.message, success: result.success });
        if (result.success) {
          setEditingId(null);
          window.location.reload();
        }
      }
    });
  };

  const handleDelete = (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setMessage(null);
    startTransition(async () => {
      const result = await deleteAddressAction(addressId);
      if (result && "success" in result) {
        setMessage({ text: result.message, success: result.success });
        if (result.success) {
          setAddresses((prev) => prev.filter((a) => a.id !== addressId));
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Feedback */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Existing addresses */}
      {addresses.length === 0 && !showForm && (
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-(--muted-foreground) text-sm">No addresses saved yet.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 relative group"
          >
            {editingId === address.id ? (
              <AddressForm
                defaultValues={address}
                onSubmit={(fd) => handleUpdate(address.id, fd)}
                onCancel={() => setEditingId(null)}
                isPending={isPending}
                submitLabel="Update"
              />
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-(--secondary-color) mt-1 shrink-0" />
                  <div className="text-sm text-(--primary-color) leading-relaxed">
                    <p className="font-medium">{address.street}</p>
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p className="text-(--muted-foreground)">{address.country}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(address.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-(--primary-color) transition-colors cursor-pointer"
                    title="Edit address"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isPending}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-(--primary-color) mb-4">New Address</h3>
          <AddressForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isPending={isPending}
            submitLabel="Add Address"
          />
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 text-sm font-medium text-(--secondary-color) hover:text-(--primary-color) transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      )}
    </div>
  );
}

// ── Reusable Address Form ──────────────────────────────────────────────────────

interface AddressFormProps {
  defaultValues?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

function AddressForm({ defaultValues, onSubmit, onCancel, isPending, submitLabel }: AddressFormProps) {
  return (
    <form
      action={onSubmit}
      className="space-y-4"
    >
      <div>
        <label htmlFor="street" className="block text-xs font-medium text-(--primary-color) mb-1">
          Street Address *
        </label>
        <input
          id="street"
          name="street"
          required
          defaultValue={defaultValues?.street}
          maxLength={500}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent"
          placeholder="123 Main St, Apt 4B"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="city" className="block text-xs font-medium text-(--primary-color) mb-1">
            City *
          </label>
          <input
            id="city"
            name="city"
            required
            defaultValue={defaultValues?.city}
            maxLength={200}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent"
            placeholder="Cairo"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-xs font-medium text-(--primary-color) mb-1">
            State / Province
          </label>
          <input
            id="state"
            name="state"
            defaultValue={defaultValues?.state}
            maxLength={200}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent"
            placeholder="Cairo"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="postalCode" className="block text-xs font-medium text-(--primary-color) mb-1">
            Postal Code *
          </label>
          <input
            id="postalCode"
            name="postalCode"
            required
            defaultValue={defaultValues?.postalCode}
            maxLength={20}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent"
            placeholder="11511"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-xs font-medium text-(--primary-color) mb-1">
            Country
          </label>
          <input
            id="country"
            name="country"
            defaultValue={defaultValues?.country ?? "Egypt"}
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent"
            placeholder="Egypt"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-(--primary-color) text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </form>
  );
}
