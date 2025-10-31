import { Trophy, TrendingUp, Star, Clock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsOverviewProps {
    stats: {
        totalInterviews: number
        technicalInterviews: number
        hrInterviews: number
        averageScore: number
        bestScore: number
        averageDuration: number
    }
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInterviews}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.technicalInterviews} Technical, {stats.hrInterviews} HR
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.averageScore}%</div>
                    <Progress value={stats.averageScore} className="mt-2 h-2" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.bestScore}%</div>
                    <p className="text-xs text-muted-foreground">Personal best</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {Math.floor(stats.averageDuration / 60)}m
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.averageDuration % 60}s average
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
