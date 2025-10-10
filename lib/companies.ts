import companies from "../src/data/companies.json"

export type Company = {
  id: string
  name: string
  logo: string
  driveLink: string
}

export async function getCompanies(): Promise<Company[]> {
  // Could be replaced by a fetch/db call later
  return companies as Company[]
}
