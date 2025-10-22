import { NextRequest, NextResponse } from 'next/server'
import { FileUploadService } from '@/lib/file-upload'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    let result
    switch (type) {
      case 'avatar':
        result = await FileUploadService.uploadAvatar(file, decoded.userId)
        break
      case 'material':
        result = await FileUploadService.uploadMaterial(file, decoded.userId)
        break
      default:
        result = await FileUploadService.uploadFile(file, type, decoded.userId)
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        filename: result.filename
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}