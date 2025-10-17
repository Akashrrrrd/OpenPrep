import mongoose from 'mongoose'

export interface ICompany {
  _id?: string
  id: string
  name: string
  logo: string
  driveLink: string
  createdAt?: Date
  updatedAt?: Date
}

const CompanySchema = new mongoose.Schema<ICompany>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    required: true
  },
  driveLink: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Create indexes for better performance
CompanySchema.index({ name: 'text' })
CompanySchema.index({ id: 1 })

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema)