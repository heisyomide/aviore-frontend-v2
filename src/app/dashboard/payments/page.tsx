import PaymentCard from '../../../components/dashboard/PaymentCard';

export default function PaymentsPage() {
  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">Payment Methods</h1>

      <div className="space-y-6">
        <PaymentCard brand="Visa" last4="3847" expiry="08/27" />
        <PaymentCard brand="Mastercard" last4="1290" expiry="05/26" />
      </div>

      <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
        Add New Card
      </button>

    </div>
  );
}