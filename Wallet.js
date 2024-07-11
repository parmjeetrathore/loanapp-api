const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
    {
        userid: { type: String, required: true },
        documentid: { type: String, required: true },
        amount: { type: Number, required: true, default: 0 },
        doctype: { type: String, required: true, enum: ["insurance", "rto", "loan"] },
        type: { type: String, required: true, default: "debit", enum: ["credit", "debit"] },
        status: { type: String, required: true, default: "pending", enum: ["pending", "done"] },
    },
    {
        timestamps: true,
        collection: "wallets",
    }
);

mongoose.model("wallets", WalletSchema);
