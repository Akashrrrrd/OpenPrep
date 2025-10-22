"use client"

import { useState, useRef } from 'react'
import { Upload, X, File, Image, FileText, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FileUploadProps {
  onUpload: (url: string, filename: string) => void
  type?: 'general' | 'avatar' | 'material'
  accept?: string
  maxSize?: number
  multiple?: boolean
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

export function FileUpload({
  onUpload,
  type = 'general',
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  className = ''
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptTypes = () => {
    if (accept) return accept
    
    switch (type) {
      case 'avatar':
        return 'image/*'
      case 'material':
        return '.pdf,.doc,.docx,.txt'
      default:
        return 'image/*,.pdf,.doc,.docx,.txt'
    }
  }

  const validateFile = (file: File): { valid: boolean, error?: string } => {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`
      }
    }

    const allowedTypes: { [key: string]: string[] } = {
      avatar: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      material: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      general: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }

    if (!allowedTypes[type].includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed'
      }
    }

    return { valid: true }
  }

  const uploadFile = async (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file ? { ...f, status: 'error', error: validation.error } : f
      ))
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadingFiles(prev => prev.map(f => 
          f.file === file ? { ...f, status: 'success', progress: 100, url: data.url } : f
        ))
        onUpload(data.url, data.filename)
      } else {
        setUploadingFiles(prev => prev.map(f => 
          f.file === file ? { ...f, status: 'error', error: data.error || 'Upload failed' } : f
        ))
      }
    } catch (error) {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file ? { ...f, status: 'error', error: 'Network error' } : f
      ))
    }
  }

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files)
    
    if (!multiple && fileArray.length > 1) {
      alert('Only one file is allowed')
      return
    }

    const newUploadingFiles = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadingFiles(prev => [...prev, ...newUploadingFiles])

    // Start uploads
    fileArray.forEach(file => {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadingFiles(prev => prev.map(f => 
          f.file === file && f.status === 'uploading' 
            ? { ...f, progress: Math.min(f.progress + 10, 90) }
            : f
        ))
      }, 100)

      uploadFile(file).finally(() => {
        clearInterval(interval)
      })
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: {getAcceptTypes()}
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptTypes()}
              multiple={multiple}
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {uploadingFile.status === 'success' ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : uploadingFile.status === 'error' ? (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getFileIcon(uploadingFile.file)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {uploadingFile.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        uploadingFile.status === 'success' ? 'default' :
                        uploadingFile.status === 'error' ? 'destructive' : 'secondary'
                      }>
                        {uploadingFile.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeFile(uploadingFile.file)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(uploadingFile.file.size)}</span>
                    {uploadingFile.status === 'uploading' && (
                      <span>{uploadingFile.progress}%</span>
                    )}
                  </div>
                  
                  {uploadingFile.status === 'uploading' && (
                    <Progress value={uploadingFile.progress} className="mt-2 h-1" />
                  )}
                  
                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <p className="text-xs text-red-600 mt-1">{uploadingFile.error}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}