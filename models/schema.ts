import mongoose, { Schema, Document } from 'mongoose';


/*****************************************Define User schema***************************************************************************** */
export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dob: string; // represents  date of birth to make sure that the user is eligible to own a bank account
    password: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true },
    dob: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },

});

export const User = mongoose.model<UserDocument>('User', userSchema);

/*****************************************End  User schema***************************************************************************** */

/*****************************************Define Wallet schema***************************************************************************** */
export interface WalletDocument extends Document {
    userId: string;
    balance: number;
    name: string;
    walletAccountNumber: string;
    openedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    transactions: mongoose.Types.ObjectId[]; // References Transaction documents
    isSuspended: { type: boolean, default: false}
}

const walletSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    name: {type: String, required: false},
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    walletAccountNumber: { type: String, required: true },
    openedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isSuspended: { type: Boolean, default: false }
    
});

export const Wallet = mongoose.model<WalletDocument>('Wallet', walletSchema);

/*****************************************End  Wallet schema***************************************************************************** */

/*****************************************Define Transaction schema***************************************************************************** */
export interface TransactionDocument extends Document {
    senderId: string;
    receiverId: string;
    walletAccountNumber: string;
    amount: number;
    timestamp: Date;
    type: 'credit' | 'debit';
}

const transactionSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['credit', 'debit'], required: true },
});

export const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema);

/******************************************End  Transaction schema*******************************************************************************/

 /*****************************************Define  Bank Account schema***************************************************************************** */
export interface BankAccountDocument extends Document {
    userId: string;
    accountNumber: string;
    openedAt: Date;
    expiresAt: Date;
    cvv: string
    balance: number;
}

const bankAccountSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true },
    openedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    cvv: { type: String, required: true },
    balance: { type: Number, default: 0 },
});

export const BankAccount = mongoose.model<BankAccountDocument>('BankAccount', bankAccountSchema);

 /*****************************************End  Bank Account schema***************************************************************************** */

  /*****************************************Define Payment schema***************************************************************************** */
export interface PaymentMethodDocument extends Document {
    id: String;
    name: string;

}

const paymentMethodSchema: Schema = new Schema({
    _id: { type: 'string', required: true},
    name: { type: String, required: true },
});
export const PaymentMethod = mongoose.model<PaymentMethodDocument>('PaymentMethod', paymentMethodSchema);

/*****************************************End  Payment schema********************************************************************************/

/*****************************************Define TransactionCategory schema***************************************************************************** */
export interface TransactionCategoryDocument extends Document {
    _id: string;
    name: string;
    transactionDate: Date;
    description: string;

}

const transactionCategorySchema: Schema = new Schema({
    _id: { type: String, required:true},
    name: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    description: { type: String, required: false },
});

export const TransactionCategory = mongoose.model<TransactionCategoryDocument>('TransactionCategory', transactionCategorySchema);

/*****************************************End  TransactionCategory schema***************************************************************************** */


/*****************************************Start Notifiation schema******************************************************************************* */
export interface NotificationDocument extends Document {
    userId: string;
    message: string;
    timestamp: Date;
}

const notificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    // Additional metadata fields
});

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);
/*****************************************End Notification schema***************************************************************************** */

