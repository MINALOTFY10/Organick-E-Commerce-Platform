import { getProfile } from "@/actions/profile-actions";
import ProfileForm from "./_components/profile-form";

export default async function AccountProfilePage() {
  const profile = await getProfile();

  if (!profile || "success" in profile) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-red-600">Unable to load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-(--primary-color)/5 p-4 md:p-5">
        <h2 className="text-2xl font-bold text-(--primary-color)">Profile & Security</h2>
        <p className="text-sm text-(--muted-foreground) mt-1">
          Follow the steps below to update personal details and password.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
