import { getCompanies } from "@/lib/companies"
import { StudyPlannerForm } from "@/components/study-planner-form"

export default async function StudyPlannerPage() {
  // Load companies on the server side - instant loading!
  const companies = await getCompanies()

  return <StudyPlannerForm companies={companies} />
}