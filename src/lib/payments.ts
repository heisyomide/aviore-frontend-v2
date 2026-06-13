import axios from 'axios';

interface InitializePaymentPayload {
  orderId: string;
  email: string;
  name?: string;
}

interface PaymentResponse {
  link: string;
  reference: string;
}

export const initializePayment = async (payload: InitializePaymentPayload): Promise<PaymentResponse> => {
  // Point this to your NestJS backend environment URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const response = await axios.post<PaymentResponse>(`${API_URL}/payments/initialize`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return response.data;
};