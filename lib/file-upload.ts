import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  error?: string
}

export class FileUploadService {
  private static readonly UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  static async uploadFile(
    file: File,
    folder: string = 'general',
    userId?: string
  ): Promise<UploadResult> {
    try {
      // Validate file size
      if (file.size > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'File size exceeds 10MB limit'
        }
      }

      // Validate file type
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        return {
          success: false,
          error: 'File type not allowed'
        }
      }

      // Create upload directory if it doesn't exist
      const uploadPath = join(this.UPLOAD_DIR, folder)
      await mkdir(uploadPath, { recursive: true })

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const filename = `${randomUUID()}.${fileExtension}`
      const filePath = join(uploadPath, filename)

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Return public URL
      const publicUrl = `/uploads/${folder}/${filename}`

      return {
        success: true,
        url: publicUrl,
        filename
      }
    } catch (error) {
      console.error('File upload error:', error)
      return {
        success: false,
        error: 'Failed to upload file'
      }
    }
  }

  static async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    // Validate image file
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Only image files are allowed for avatars'
      }
    }

    // Limit avatar size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      return {
        success: false,
        error: 'Avatar size must be less than 2MB'
      }
    }

    return this.uploadFile(file, 'avatars', userId)
  }

  static async uploadMaterial(file: File, userId: string): Promise<UploadResult> {
    // Allow documents and PDFs for materials
    const allowedMaterialTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedMaterialTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only PDF, DOC, DOCX, and TXT files are allowed for materials'
      }
    }

    return this.uploadFile(file, 'materials', userId)
  }

  static getFileUrl(filename: string, folder: string = 'general'): string {
    return `/uploads/${folder}/${filename}`
  }

  static validateFile(file: File, maxSize?: number, allowedTypes?: string[]): { valid: boolean, error?: string } {
    const maxFileSize = maxSize || this.MAX_FILE_SIZE
    const types = allowedTypes || this.ALLOWED_TYPES

    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`
      }
    }

    if (!types.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed'
      }
    }

    return { valid: true }
  }
}