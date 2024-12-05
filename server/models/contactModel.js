import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
    },
    lastName: {
      type: String,
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
    phoneNumber: {
      type: String,
      match: [
        /^[0-9]{10}$/,
        'Phone number must be 10 digits.',
      ],
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead', // Reference to the lead this contact belongs to
      required: true,
    },
    notes: {
      type: String, // Additional notes about the contact
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export default mongoose.model('Contact', contactSchema);
