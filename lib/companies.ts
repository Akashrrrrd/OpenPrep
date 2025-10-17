import connectDB from './mongodb'
import Company, { ICompany } from './models/Company'

export type Company = {
  id: string
  name: string
  logo: string
  driveLink: string
}

export async function getCompanies(): Promise<Company[]> {
  try {
    await connectDB()
    const companies = await Company.find({}).sort({ name: 1 }).lean()
    
    return companies.map((company: ICompany) => ({
      id: company.id,
      name: company.name,
      logo: company.logo,
      driveLink: company.driveLink
    }))
  } catch (error) {
    console.error('Error fetching companies:', error)
    return []
  }
}

export async function getCompanyById(id: string): Promise<Company | null> {
  try {
    await connectDB()
    const company = await Company.findOne({ id }).lean()
    
    if (!company) return null
    
    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
      driveLink: company.driveLink
    }
  } catch (error) {
    console.error('Error fetching company:', error)
    return null
  }
}

export async function createCompany(companyData: Omit<Company, '_id'>): Promise<Company | null> {
  try {
    await connectDB()
    const company = new Company(companyData)
    const savedCompany = await company.save()
    
    return {
      id: savedCompany.id,
      name: savedCompany.name,
      logo: savedCompany.logo,
      driveLink: savedCompany.driveLink
    }
  } catch (error) {
    console.error('Error creating company:', error)
    return null
  }
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
  try {
    await connectDB()
    const company = await Company.findOneAndUpdate(
      { id },
      updates,
      { new: true, runValidators: true }
    ).lean()
    
    if (!company) return null
    
    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
      driveLink: company.driveLink
    }
  } catch (error) {
    console.error('Error updating company:', error)
    return null
  }
}

export async function deleteCompany(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await Company.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting company:', error)
    return false
  }
}
