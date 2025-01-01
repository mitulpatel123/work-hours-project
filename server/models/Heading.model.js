import mongoose from 'mongoose';

const headingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Heading name is required'],
      trim: true,
      minlength: [2, 'Heading name must be at least 2 characters'],
      maxlength: [50, 'Heading name cannot exceed 50 characters']
    },
    order: {
      type: Number,
      required: true,
      min: [0, 'Order must be a non-negative number']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add compound index for user and order
headingSchema.index({ user: 1, order: 1 });

// Ensure heading names are unique per user
headingSchema.index({ user: 1, name: 1 }, { unique: true });

// Pre-save middleware to ensure order is set
headingSchema.pre('save', async function(next) {
  if (this.isNew && this.order === undefined) {
    try {
      const lastHeading = await this.constructor.findOne({ 
        user: this.user 
      }).sort({ order: -1 });
      
      this.order = lastHeading ? lastHeading.order + 1 : 0;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Heading = mongoose.model('Heading', headingSchema);

export default Heading;