"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.extractInvoicesFromEmail = exports.syncEmails = exports.connectOutlook = exports.connectGmail = exports.processUploadedImage = exports.analyzeReceipt = exports.analyzeInvoice = exports.getExpensesByUser = exports.listExpenses = exports.deleteExpense = exports.updateExpense = exports.getExpense = exports.createExpense = exports.getInvoicesByUser = exports.listInvoices = exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.createInvoice = exports.onUserCreated = exports.deleteUser = exports.createUser = exports.auth = exports.storage = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const auth_1 = require("./functions/auth");
const invoices_1 = require("./functions/invoices");
const expenses_1 = require("./functions/expenses");
const vision_1 = require("./functions/vision");
const email_1 = require("./functions/email");
// Initialize Firebase Admin
admin.initializeApp();
// Export Firestore instance
exports.db = admin.firestore();
exports.storage = admin.storage();
exports.auth = admin.auth();
// Export all functions
exports.createUser = auth_1.authFunctions.createUser, exports.deleteUser = auth_1.authFunctions.deleteUser, exports.onUserCreated = auth_1.authFunctions.onUserCreated;
exports.createInvoice = invoices_1.invoiceFunctions.createInvoice, exports.getInvoice = invoices_1.invoiceFunctions.getInvoice, exports.updateInvoice = invoices_1.invoiceFunctions.updateInvoice, exports.deleteInvoice = invoices_1.invoiceFunctions.deleteInvoice, exports.listInvoices = invoices_1.invoiceFunctions.listInvoices, exports.getInvoicesByUser = invoices_1.invoiceFunctions.getInvoicesByUser;
exports.createExpense = expenses_1.expenseFunctions.createExpense, exports.getExpense = expenses_1.expenseFunctions.getExpense, exports.updateExpense = expenses_1.expenseFunctions.updateExpense, exports.deleteExpense = expenses_1.expenseFunctions.deleteExpense, exports.listExpenses = expenses_1.expenseFunctions.listExpenses, exports.getExpensesByUser = expenses_1.expenseFunctions.getExpensesByUser;
exports.analyzeInvoice = vision_1.visionFunctions.analyzeInvoice, exports.analyzeReceipt = vision_1.visionFunctions.analyzeReceipt, exports.processUploadedImage = vision_1.visionFunctions.processUploadedImage;
exports.connectGmail = email_1.emailFunctions.connectGmail, exports.connectOutlook = email_1.emailFunctions.connectOutlook, exports.syncEmails = email_1.emailFunctions.syncEmails, exports.extractInvoicesFromEmail = email_1.emailFunctions.extractInvoicesFromEmail;
// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'BuildBills Functions',
    });
});
//# sourceMappingURL=index.js.map