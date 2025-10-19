import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UsageTracker } from '@/lib/usage-tracker'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { action, data } = await request.json()

    switch (action) {
      case 'study_plan':
        const studyPlanCheck = await UsageTracker.checkStudyPlanLimit(user.id)
        if (!studyPlanCheck.allowed) {
          return NextResponse.json({
            error: 'Usage limit exceeded',
            requiresUpgrade: studyPlanCheck.requiresUpgrade,
            limit: studyPlanCheck.limit,
            current: studyPlanCheck.current
          }, { status: 403 })
        }
        await UsageTracker.trackStudyPlanGeneration(user.id)
        break

      case 'company_access':
        const { companyId } = data
        const companyCheck = await UsageTracker.checkCompanyAccess(user.id, companyId)
        if (!companyCheck.allowed) {
          return NextResponse.json({
            error: 'Company access limit exceeded',
            requiresUpgrade: companyCheck.requiresUpgrade,
            limit: companyCheck.limit,
            current: companyCheck.current
          }, { status: 403 })
        }
        await UsageTracker.trackCompanyAccess(user.id, companyId)
        break

      case 'forum_post':
        const forumCheck = await UsageTracker.checkForumPostLimit(user.id)
        if (!forumCheck.allowed) {
          return NextResponse.json({
            error: 'Forum post limit exceeded',
            requiresUpgrade: forumCheck.requiresUpgrade,
            limit: forumCheck.limit,
            current: forumCheck.current
          }, { status: 403 })
        }
        await UsageTracker.trackForumPost(user.id)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    )
  }
}