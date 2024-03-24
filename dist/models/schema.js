import mongoose, { Schema } from 'mongoose';
var userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
export var User = mongoose.model('User', userSchema);
var walletSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    walletAccountNumber: { type: String, required: true },
    openedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isSuspended: { type: Boolean, default: false }
});
export var Wallet = mongoose.model('Wallet', walletSchema);
var transactionSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['credit', 'debit'], required: true },
});
export var Transaction = mongoose.model('Transaction', transactionSchema);
var bankAccountSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true },
    openedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    cvv: { type: String, required: true },
    balance: { type: Number, default: 0 },
});
export var BankAccount = mongoose.model('BankAccount', bankAccountSchema);
var paymentMethodSchema = new Schema({
    _id: { type: 'string', required: true },
    name: { type: String, required: true },
});
export var PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
var transactionCategorySchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    description: { type: String, required: false },
});
export var TransactionCategory = mongoose.model('TransactionCategory', transactionCategorySchema);
var notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    // Additional metadata fields
});
export var Notification = mongoose.model('Notification', notificationSchema);
/*****************************************End Notification schema***************************************************************************** */
