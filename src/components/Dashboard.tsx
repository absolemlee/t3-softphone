// Example: src/components/Dashboard.tsx
import Softphone from "~/components/Softphone";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Dashboard</h2>
      {/* Embed the softphone for users */}
      <Softphone />
      {/* ...other dashboard content... */}
    </div>
  );
}
