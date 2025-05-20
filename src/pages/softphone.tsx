// src/pages/softphone.tsx
import Softphone from "~/components/Softphone";

export default function SoftphoneAdminPage() {
  // TODO: Protect this route for admin-only access!
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Softphone Panel</h2>
      <Softphone admin />
    </main>
  );
}
