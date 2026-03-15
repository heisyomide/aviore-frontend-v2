interface PaymentCardProps {
  brand: string;
  last4: string;
  expiry: string;
}

export default function PaymentCard({ brand, last4, expiry }: PaymentCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-semibold">{brand} **** {last4}</p>
        <p className="text-sm text-gray-500">Expires {expiry}</p>
      </div>

      <button className="text-red-500 text-sm hover:underline">
        Remove
      </button>
    </div>
  );
}