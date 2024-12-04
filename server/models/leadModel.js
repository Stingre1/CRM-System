import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    leadName: {
        type: String,
        required: [true, 'Lead name is required'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [
            /^[0-9]{10}$/, 
            'Phone number must be 10 digits.'
        ],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Please enter a valid email address.',
        ],
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
    },
    status: {
        type: String,
        enum: ['New', 'Assigned', 'In Progress', 'Closed'],
        default: 'New',
    },
    leadDetails: {
        type: String, //extra details that need to be mentioned about the lead
    },
},
{
    timestamps: true,
}
);


export default mongoose.model('Lead', leadSchema);
