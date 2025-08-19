import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },

    companyName : {
        type : String,
        required : [true, 'Company name is required'],
        trim : true
    },
    recipientEmail : {
        type : String,
        required : [true, 'Recipient email is required'],
        lowercase : true,
        trim : true
    },
   emailBody: {
  type: String,
  required: [true, 'Email body is required'],
  trim: true
},

    sentAt : {
        type : Date,
        default : Date.now
    }
,}, {
    timestamps : true
});

export const Application = mongoose.model("Application", applicationSchema);