import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  company_id: mongoose.Types.ObjectId;
  title: string;
  job_slug: string;
  work_policy: 'Remote' | 'On-site' | 'Hybrid';
  department: string;
  employment_type: 'Full Time' | 'Part Time' | 'Contract';
  experience_level: 'Senior' | 'Mid-Level' | 'Junior';
  job_type: 'Permanent' | 'Temporary' | 'Internship';
  location: string;
  salary_range: string;
  description: string;
  isOpen: boolean;
  date_posted: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true, // For fast querying by company
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    job_slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    work_policy: {
      type: String,
      enum: {
        values: ['Remote', 'On-site', 'Hybrid'],
        message: '{VALUE} is not a valid work policy',
      },
      required: [true, 'Work policy is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    employment_type: {
      type: String,
      enum: {
        values: ['Full Time', 'Part Time', 'Contract'],
        message: '{VALUE} is not a valid employment type',
      },
      required: [true, 'Employment type is required'],
    },
    experience_level: {
      type: String,
      enum: {
        values: ['Senior', 'Mid-Level', 'Junior'],
        message: '{VALUE} is not a valid experience level',
      },
      required: [true, 'Experience level is required'],
    },
    job_type: {
      type: String,
      enum: {
        values: ['Permanent', 'Temporary', 'Internship'],
        message: '{VALUE} is not a valid job type',
      },
      required: [true, 'Job type is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary_range: {
      type: String,
      required: [true, 'Salary range is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    date_posted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
JobSchema.index({ company_id: 1, isOpen: 1 });
JobSchema.index({ department: 1 });
JobSchema.index({ work_policy: 1 });
JobSchema.index({ employment_type: 1 });

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
