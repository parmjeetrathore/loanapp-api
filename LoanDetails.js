const mongoose = require("mongoose");


const LoanSchema = new mongoose.Schema(
    {

        // Applicant
        userid: { type: String, required: true, },
        applicant_name: { type: String, required: true },
        applicant_mobile: { type: Number, required: true },
        vehicle_name: { type: String, required: true },
        applicant_aadharcard_number: { type: Number, required: true },
        applicant_aadharcard: { type: String, required: true },
        applicant_pancard_number: { type: String, required: true },
        applicant_pancard: { type: String, required: true },
        applicant_dl_number: { type: String, required: true },
        applicant_dl: { type: String, required: true },
        applicant_udhyamcard_number: { type: String, required: true },
        applicant_udhyamcard: { type: String, required: true },
        applicant_photo: { type: String, required: true },


        // Co-Applicant
        coapplicant_aadharcard_number: { type: Number, required: true },
        coapplicant_aadharcard: { type: String, required: true },
        coapplicant_pancard_number: { type: String, required: true },
        coapplicant_pancard: { type: String, required: true },
        coapplicant_voterid_number: { type: String, required: true },
        coapplicant_voterid: { type: String, required: true },
        coapplicant_photo: { type: String, required: true },


        // Guarantor
        guarantor_aadharcard_number: { type: Number, required: true },
        guarantor_aadharcard: { type: String, required: true },
        guarantor_pancard_number: { type: String, required: true },
        guarantor_pancard: { type: String, required: true },
        guarantor_voterid_number: { type: String, required: true },
        guarantor_voterid: { type: String, required: true },
        guarantor_rc_number: { type: String, required: true },
        guarantor_rc: { type: String, required: true },
        guarantor_photo: { type: String, required: true },


        // Vehicle
        vehicle_rc_number: { type: String, required: true },
        vehicle_rc: { type: String, required: true },
        vehicle_insurance_number: { type: String, required: true, },
        vehicle_insurance: { type: String, required: true },
        vehicle_tax: { type: String, required: true },
        vehicle_permit: { type: String, required: true },
        saler_aadharcardnumber: { type: Number, required: true },
        saler_aadharcard: { type: String, required: true },
        sale_agreement: { type: String, required: true },


        // Other
        electricity_bill: { type: String, required: true },
        agreement: { type: String, required: true },
        banking: { type: String, required: true },
        
        
        //
        status: { type: Boolean, required: true, default: false },
        default: { type: String, required: true, default: "allloan" }
    },
    { timestamps: true },
    {
        collection: "allloan",
    }
);



mongoose.model("allloan", LoanSchema);