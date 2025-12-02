import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  slug: string;
  name: string;
  email: string;
  password: string;
  logo_url?: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    font: string;
    titleColor: string;
    bodyColor: string;
    buttonTextColor: string;
  };
  departments: string[];
  content_sections: Array<{
    type: 'hero' | 'text' | 'video' | 'gallery';
    title: string;
    content: string;
    image_url?: string;
    video_url?: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-z0-9-]+$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default
    },
    logo_url: {
      type: String,
      default: '',
    },
    theme: {
      primaryColor: {
        type: String,
        default: '#2563eb', // Modern blue
      },
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
      font: {
        type: String,
        default: 'Inter',
      },
      titleColor: {
        type: String,
        default: '#111827',
      },
      bodyColor: {
        type: String,
        default: '#4b5563',
      },
      buttonTextColor: {
        type: String,
        default: '#ffffff',
      },
    },
    departments: {
      type: [String],
      default: [],
    },
    content_sections: [
      {
        type: {
          type: String,
          enum: ['hero', 'text', 'video', 'gallery'],
          required: true,
        },
        title: String,
        content: String,
        image_url: String,
        video_url: String,
        order: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
// Email and slug are already indexed by unique: true and index: true in schema definition

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
