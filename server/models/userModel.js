import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Username is required.'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters.'],
      maxlength: [50, 'Username must not exceed 50 characters.'],
      match: [/^[A-Za-z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //regex dw about it
        'Please enter a valid email address.',
      ],
    },
    password: {
      type: String,
      required: [
        function() { // Conditional required validator
          return this.isNew; // Password is required only when creating a *new* user
        },
        'Password is required.'
      ],
      // minlength: [ // <--- Make 'minlength' also conditional - array for validators
      //   function() {
      //     return typeof this.password === 'string' && this.password.length > 0; // Check if password is a non-empty string
      //   },
      //   'Password must be at least 8 characters.'
      // ],
    },
    role: {
      type: String,
      enum: ['Admin', 'Sales Manager', 'Sales Rep'], // Adjust as needed for your roles
      default: 'Sales Rep',
    },
  },
  {
    timestamps: true
  },
);

export default mongoose.model('User', userSchema);
