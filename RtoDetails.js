const mongoose = require("mongoose");


const RtoSchema = new mongoose.Schema(
    {
        userid: { type: String, required: true },
        vehicle_no: { type: String, required: true, unique: true },
        uiid: { type: String, required: true },
        vehicle_insurance_number: { type: String, required: true },
        vehicle_insurance: { type: String, required: true },// Storing file path 
        vehicle_insurance_expiry: { type: Date, required: true },
        fitness_number: { type: String, required: true },
        fitness: { type: String, required: true },// Storing file path
        fitness_expiry: { type: Date, required: true },
        puc_number: { type: String, required: true },
        puc: { type: String, required: true },// Storing file path
        puc_expiry: { type: Date, required: true },
        permit_number: { type: String, required: true },
        permit: { type: String, required: true },// Storing file path
        permit_expiry: { type: Date, required: true },
        tax_number: { type: String, required: true },
        tax: { type: String, required: true },// Storing file path
        tax_expiry: { type: Date, required: true },
        rc_number: { type: String, required: true },
        rc: { type: String, required: true },// Storing file path
        rc_expiry: { type: Date, required: true },
        other: { type: [String] } // storing file paths
    },
    { timestamps: true },
    {
        collection: "allrtoinformation",
    }
);



mongoose.model("allrtoinformation", RtoSchema);