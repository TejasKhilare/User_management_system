import { useParams } from "react-router-dom";

export default function UserDetails() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        User Details – ID {id}
      </h1>
      <p className="text-gray-600 mt-2">
        Page under construction
      </p>
    </div>
  );
}
