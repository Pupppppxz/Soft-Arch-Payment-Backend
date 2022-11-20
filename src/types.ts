export interface NotificationResponse {
  message: string;
}

export interface ReceiveNotified {
  destEmail: string;
  date: Date | string;
  sourceName: string;
  destPhoneNumber: string;
  sourceAccountNumber: string;
  sourceBankName: string;
  status: string;
  destAccountNumber: string;
  destAccountName: string;
  amount: number;
  fee: number;
  availableBalance: number;
}

export interface TransferNotified {
  destEmail: string;
  date: Date | string;
  sourceAccountNumber: string;
  destBank: string;
  destAccountNumber: string;
  destAccountName: string;
  paymentStatus: string;
  sourcePhoneNumber: string;
  amount: number;
  fee: number;
  availableBalance: number;
  transactionNumber: string;
}

export interface TransactionResponse {
  transactionID: string;
  message: string;
}

export interface UserTransactionBody {
  accountID: string;
  IPAddress: string;
  userAccountNumber: string;
  otherAccountNumber: string;
  nameOther: string;
  bankNameOther: string;
  amount: number;
  balance: number;
  fee: number;
  type: string;
  date: Date | string;
}

export interface ShopTransactionBody {
  shopID: string;
  shopAccountNumber: string;
  userAccountNumber: string;
  nameUser: string;
  bankNameUser: string;
  amount: number;
  balance: number;
  fee: number;
  type: string;
  isFinish: boolean;
  date: Date | string;
}

export interface Transferred {
  id: string;
  balance: number;
}

export interface CallbackResponse {
  status?: number;
}
