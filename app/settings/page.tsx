"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Trash2,
  Save,
  Crown,
  Award,
  Building2,
  Target,
  BookOpen
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    college: "",
    graduationYear: "",
    targetCompanies: [] as string[],
    preparationLevel: "",
    focusAreas: [] as string[]
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    studyReminders: true,
    weeklyProgress: true
  })

  const [newTargetCompany, setNewTargetCompany] = useState("")
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        college: user.profile?.college || "",
        graduationYear: user.profile?.graduationYear?.toString() || "",
        targetCompanies: user.profile?.targetCompanies || [],
        preparationLevel: user.profile?.preparationLevel || "beginner",
        focusAreas: user.profile?.focusAreas || []
      })
      setPreferences({
        emailNotifications: user.preferences?.emailNotifications ?? true,
        studyReminders: user.preferences?.studyReminders ?? true,
        weeklyProgress: user.preferences?.weeklyProgress ?? true
      })
    }
  }, [user])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies')
        if (response.ok) {
          const companiesData = await response.json()
          setCompanies(companiesData)
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchCompanies()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          profile: {
            college: profileData.college,
            graduationYear: profileData.graduationYear ? parseInt(profileData.graduationYear) : undefined,
            targetCompanies: profileData.targetCompanies,
            preparationLevel: profileData.preparationLevel,
            focusAreas: profileData.focusAreas
          },
          preferences
        }),
      })

      if (response.ok) {
        toast({
          title: "Settings Updated",
          description: "Your profile settings have been saved successfully.",
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update your settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addTargetCompany = () => {
    if (newTargetCompany && !profileData.targetCompanies.includes(newTargetCompany)) {
      setProfileData(prev => ({
        ...prev,
        targetCompanies: [...prev.targetCompanies, newTargetCompany]
      }))
      setNewTargetCompany("")
    }
  }

  const removeTargetCompany = (company: string) => {
    setProfileData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.filter(c => c !== company)
    }))
  }

  const toggleFocusArea = (area: string) => {
    setProfileData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }))
  }

  const getSubscriptionBadge = () => {
    if (!user) return null
    switch (user.subscriptionTier) {
      case 'premium':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="w-3 h-3 mr-1" />Premium</Badge>
      case 'pro':
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"><Award className="w-3 h-3 mr-1" />Pro</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-center transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preparation preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College/University</Label>
                      <Input
                        id="college"
                        value={profileData.college}
                        onChange={(e) => setProfileData(prev => ({ ...prev, college: e.target.value }))}
                        placeholder="Enter your college name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Select 
                        value={profileData.graduationYear} 
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, graduationYear: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => 2024 + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Preparation Level */}
                  <div className="space-y-2">
                    <Label>Preparation Level</Label>
                    <Select 
                      value={profileData.preparationLevel} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, preparationLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-3">
                    <Label>Focus Areas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['aptitude', 'coding', 'technical', 'hr'].map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <Switch
                            id={area}
                            checked={profileData.focusAreas.includes(area)}
                            onCheckedChange={() => toggleFocusArea(area)}
                          />
                          <Label htmlFor={area} className="capitalize">
                            {area === 'hr' ? 'HR' : area}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Companies */}
                  <div className="space-y-3">
                    <Label>Target Companies</Label>
                    <div className="flex gap-2">
                      <Select value={newTargetCompany} onValueChange={setNewTargetCompany}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies
                            .filter(c => !profileData.targetCompanies.includes(c.name))
                            .map((company) => (
                            <SelectItem key={company.id} value={company.name}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addTargetCompany} disabled={!newTargetCompany}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profileData.targetCompanies.map((company) => (
                        <Badge key={company} variant="secondary" className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {company}
                          <button
                            onClick={() => removeTargetCompany(company)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Profile
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you'd like to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and important announcements
                        </p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Study Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get reminded about your study schedule and goals
                        </p>
                      </div>
                      <Switch
                        checked={preferences.studyReminders}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, studyReminders: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Progress Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly summaries of your preparation progress
                        </p>
                      </div>
                      <Switch
                        checked={preferences.weeklyProgress}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyProgress: checked }))}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Preferences
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "subscription" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription & Billing
                  </CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.subscriptionTier === 'free' && 'Free plan with basic features'}
                        {user.subscriptionTier === 'pro' && 'Pro plan with advanced features'}
                        {user.subscriptionTier === 'premium' && 'Premium plan with all features'}
                      </p>
                    </div>
                    {getSubscriptionBadge()}
                  </div>

                  {user.subscriptionTier === 'free' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Upgrade Benefits</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-500" />
                          Unlimited study plans
                        </li>
                        <li className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-500" />
                          Access to all company data
                        </li>
                        <li className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          Premium interview experiences
                        </li>
                        <li className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-green-500" />
                          Priority support
                        </li>
                      </ul>
                      <Button asChild className="w-full">
                        <a href="/pricing">Upgrade Now</a>
                      </Button>
                    </div>
                  )}

                  {user.subscriptionTier !== 'free' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Subscription Details</h4>
                        <p className="text-sm text-muted-foreground">
                          Status: {user.subscriptionStatus}
                        </p>
                        {user.subscriptionEndDate && (
                          <p className="text-sm text-muted-foreground">
                            Next billing: {new Date(user.subscriptionEndDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage Billing
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Password</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Last changed: Never
                      </p>
                      <Button variant="outline">
                        Change Password
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Account Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download a copy of your account data
                      </p>
                      <Button variant="outline">
                        Export Data
                      </Button>
                    </div>

                    <div className="p-4 border border-destructive rounded-lg">
                      <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}