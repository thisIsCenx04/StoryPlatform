export type DonationStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface DonationPayload {
  donorName: string
  amount: number
  currency: string
  message?: string
  paymentMethod?: string
  paymentTxnId?: string
}

export interface Donation extends DonationPayload {
  id: string
  status: DonationStatus
  createdAt: string
}

export interface PaymentCheckoutResponse {
  donationId: string
  paymentUrl: string
  provider: string
}
