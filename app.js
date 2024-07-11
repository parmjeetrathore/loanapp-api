const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const MongoUrl = "mongodb+srv://parmjeetrathore27:CKS2l7b203n18nJP@cluster0.i2uewxh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET = "eiayroirpyvnrojyseplandpcrklibaprejoatasltocaipmseecheft";

mongoose.connect(MongoUrl).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log(e);
});

require("./UserDetails");
const User = mongoose.model("User");

require("./InsuranceDetails");
const allinsurance = mongoose.model("allinsurance");

require("./RtoDetails");
const allrtoinformation = mongoose.model("allrtoinformation");

require("./LoanDetails");
const allloan = mongoose.model("allloan");

require("./Wallet");
const wallets = mongoose.model("wallets");





app.get("/", (req, res) => {
    res.send({ status: "Started" });
});



app.post('/register', async (req, res) => {
    const { name, email, mobile_no, password, aadharcard, user_type, status } = req.body;
    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
        return res.send({ data: "User already exists!!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({
            name, email, mobile_no, password: encryptedPassword, aadharcard
        });
        res.send({ status: "ok", data: "User Created" });
    } catch (error) {
        res.send({ status: "error", data: error });
        console.log(error)
    }
});

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(202).send({ data: "User doesn't exist!" });
        } else if (!user.status) {
            return res.status(203).send({ data: "User not approved. Contact admin for access." });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET);
            return res.status(200).send({ status: "ok", data: token });
        } else {
            return res.send({ data: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).send({ data: "An error occurred", error: error.message });
    }
});

app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const useremail = user.email;
        User.findOne({ email: useremail }).then((data) => {
            return res.send({ status: "ok", data: data });
        })
    } catch (error) {
        return res.send({ error: error });
    }
})



// INSURANCE

app.post('/addinsurance', async (req, res) => {
    const { userid, name, mobile_no, vehicle_no, rc_no, rc, aadharcard_no, aadharcard, pan_card_no, pan_card, old_policy_no, old_policy, status, other } = req.body;
    const oldInsurance = await allinsurance.findOne({ vehicle_no });

    if (oldInsurance) {
        return res.send({ data: "Insurance already exists!" });
    }

    try {
        const newInsurance = await allinsurance.create({
            userid, name, mobile_no, vehicle_no, rc_no, rc, aadharcard_no, aadharcard, pan_card_no, pan_card, old_policy_no, old_policy, status, other
        });
        res.send({ status: "ok", data: "Insurance Created", id: newInsurance._id });

    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});



app.post('/getuserinsurance', async (req, res) => {
    const { userid } = req.body;
    try {
        const userInsurance = await allinsurance.find({ userid: userid });
        if (userInsurance.length === 0) {
            return res.status(200).send({ status: "ok", data: [], message: "No Insurance found for this user" });
        }
        return res.status(200).send({ status: "ok", data: userInsurance });
    } catch (error) {
        return res.status(500).send({ data: "An error occurred", error: error.message });
    }
});


app.get('/insurance/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const insurance = await allinsurance.findOne({ _id: id });
        if (!insurance) {
            return res.status(404).send({ data: "Insurance not found" });
        }
        return res.status(200).send({ status: "ok", data: insurance });
    } catch (error) {
        return res.status(500).send({ data: "An error occurred", error: error.message });
    }
});


app.post('/updateinsurance', async (req, res) => {
    const { userid, name, mobile_no, vehicle_no, rc_no, rc, aadharcard_no, aadharcard, pan_card_no, pan_card, old_policy_no, old_policy, status, other } = req.body;
    const insurance = await allinsurance.findOne({ vehicle_no });

    if (!insurance) {
        return res.send({ data: "Insurance does not exist!" });
    }

    try {
        insurance.userid = userid || insurance.userid;
        insurance.name = name || insurance.name;
        insurance.mobile_no = mobile_no || insurance.mobile_no;
        insurance.rc_no = rc_no || insurance.rc_no;
        insurance.rc = rc || insurance.rc;
        insurance.aadharcard_no = aadharcard_no || insurance.aadharcard_no;
        insurance.aadharcard = aadharcard || insurance.aadharcard;
        insurance.pan_card_no = pan_card_no || insurance.pan_card_no;
        insurance.pan_card = pan_card || insurance.pan_card;
        insurance.old_policy_no = old_policy_no || insurance.old_policy_no;
        insurance.old_policy = old_policy || insurance.old_policy;
        insurance.status = status || insurance.status;
        insurance.other = other || insurance.other;

        await insurance.save();
        res.send({ status: "ok", data: "Insurance Updated", id: insurance._id });

    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});


//RTO

app.post('/addrto', async (req, res) => {
    const { userid, vehicle_no, uiid, vehicle_insurance_number, vehicle_insurance, vehicle_insurance_expiry, fitness_number, fitness, fitness_expiry, puc_number, puc, puc_expiry, permit_number, permit, permit_expiry, tax_number, tax, tax_expiry, rc_number, rc, rc_expiry, other } = req.body;
    const oldRto = await allrtoinformation.findOne({ vehicle_no: vehicle_no });

    if (oldRto) {
        return res.send({ data: "Rto already exists!" });


    }


    try {
        const newRto = await allrtoinformation.create({
            userid, vehicle_no, uiid, vehicle_insurance_number, vehicle_insurance, vehicle_insurance_expiry, fitness_number, fitness, fitness_expiry, puc_number, puc, puc_expiry, permit_number, permit, permit_expiry, tax_number, tax, tax_expiry, rc_number, rc, rc_expiry, other
        });
        res.send({ status: "ok", data: "Rto Created", id: newRto._id });


    } catch (error) {
        console.log(error)
        res.send({ status: "error", data: error });

    }
});

app.post('/getuserrto', async (req, res) => {   
    const { userid } = req.body;
    try {
        const userRto = await allrtoinformation.find({ userid: userid });
        if (userRto.length === 0) {
            return res.status(200).send({ status: "ok", data: [], message: "No Rto found for this user" });
        }
        return res.status(200).send({ status: "ok", data: userRto });
    } catch (error) {
        return res.status(500).send({ data: "An error occurred", error: error.message });
    }
});

app.get('/rto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const insurance = await allrtoinformation.findOne({ _id: id });
        if (!insurance) {
            return res.status(404).send({ data: "Rto not found" });
        }
        return res.status(200).send({ status: "ok", data: insurance });
    } catch (error) {
        return res.status(500).send({ data: "An error occurred", error: error.message });
    }
});



// Loan
app.post('/addloan', async (req, res) => {

    const {
        userid,
        applicant_name,
        applicant_mobile,
        vehicle_name,
        applicant_aadharcard_number,
        applicant_aadharcard,
        applicant_pancard_number,
        applicant_pancard,
        applicant_dl_number,
        applicant_dl,
        applicant_udhyamcard_number,
        applicant_udhyamcard,
        applicant_photo,
        coapplicant_aadharcard_number,
        coapplicant_aadharcard,
        coapplicant_pancard_number,
        coapplicant_pancard,
        coapplicant_voterid_number,
        coapplicant_voterid,
        coapplicant_photo,
        guarantor_aadharcard_number,
        guarantor_aadharcard,
        guarantor_pancard_number,
        guarantor_pancard,
        guarantor_voterid_number,
        guarantor_voterid,
        guarantor_rc_number,
        guarantor_rc,
        guarantor_photo,
        vehicle_rc_number,
        vehicle_rc,
        vehicle_insurance_number,
        vehicle_insurance,
        vehicle_tax,
        vehicle_permit,
        saler_aadharcardnumber,
        saler_aadharcard,
        sale_agreement,
        electricity_bill,
        agreement,
        banking,
        status
    } = req.body;


    try {
        const newLoan = await allloan.create({
            userid,
            applicant_name,
            applicant_mobile,
            vehicle_name,
            applicant_aadharcard_number,
            applicant_aadharcard,
            applicant_pancard_number,
            applicant_pancard,
            applicant_dl_number,
            applicant_dl,
            applicant_udhyamcard_number,
            applicant_udhyamcard,
            applicant_photo,
            coapplicant_aadharcard_number,
            coapplicant_aadharcard,
            coapplicant_pancard_number,
            coapplicant_pancard,
            coapplicant_voterid_number,
            coapplicant_voterid,
            coapplicant_photo,
            guarantor_aadharcard_number,
            guarantor_aadharcard,
            guarantor_pancard_number,
            guarantor_pancard,
            guarantor_voterid_number,
            guarantor_voterid,
            guarantor_rc_number,
            guarantor_rc,
            guarantor_photo,
            vehicle_rc_number,
            vehicle_rc,
            vehicle_insurance_number,
            vehicle_insurance,
            vehicle_tax,
            vehicle_permit,
            saler_aadharcardnumber,
            saler_aadharcard,
            sale_agreement,
            electricity_bill,
            agreement,
            banking,
            status
        });

        res.send({ status: "ok", data: "Loan Created", id: newLoan._id });


    } catch (error) {
        res.send({ status: "error", data: error });

    }
});


app.post('/getuserloan', async (req, res) => {
    const { userid } = req.body;
    try {
        const userLoan = await allloan.find({ userid: userid });
        if (userLoan.length === 0) {
            return res.status(200).send({ status: "ok", data: [], message: "No loan found for this user" });
        }
        return res.status(200).send({ status: "ok", data: userLoan });
    } catch (error) {
        return res.status(500).send({ status: "error", data: [], message: "An error occurred", error: error.message });
    }
});

app.get('/loan/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const loan = await allloan.findOne({ _id: id });
        if (!loan) {
            return res.status(404).send({ data: "loan not found" });
        }
        return res.status(200).send({ status: "ok", data: loan });
    } catch (error) {
        return res.status(500).send({ data: "An error occurred", error: error.message });
    }
});

// upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Optional: specify a folder in Cloudinary
    },
});

const upload = multer({ storage: storage });

// Endpoint to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {

    try {
        res.json({
            message: 'Image uploaded successfully',
            url: req.file.path,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Wallet
app.post('/addamount', async (req, res) => {
    const { userid, documentid, doctype, amount, type } = req.body;

    try {
        await wallets.create({
            userid, documentid, doctype, amount, type
        });
        res.send({ status: "ok", data: "Amount Add" });
    } catch (error) {
        res.send({ status: "error", data: error });
        console.log(error)
    }
});

app.post('/getuserwallet', async (req, res) => {
    const { userid } = req.body;
    try {
        const userWallet = await wallets.find({ userid: userid });
        if (userWallet.length === 0) {
            return res.status(200).send({ status: "ok", data: [], message: "No Transaction found for this user" });
        }
        return res.status(200).send({ status: "ok", data: userWallet });
    } catch (error) {
        return res.status(500).send({ status: "error", data: [], message: "An error occurred", error: error.message });
    }
});




app.listen(5001, () => {
    console.log("Node js server started");
});
