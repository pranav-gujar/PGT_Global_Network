import React, { useState, useRef } from 'react'
import { X, Upload, Camera, Check } from 'lucide-react'

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onImageSelect: (file: File, previewUrl: string) => void
  currentImage?: string
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  currentImage
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setSelectedFile(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
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
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleConfirm = () => {
    if (selectedFile && previewUrl) {
      onImageSelect(selectedFile, previewUrl)
      onClose()
    }
  }

  const handleClose = () => {
    setPreviewUrl(currentImage || '')
    setSelectedFile(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Update Profile Photo
          </h2>
          <p className="text-muted-foreground">
            Upload a new profile photo or update your existing one
          </p>
        </div>

        {/* Preview Section */}
        {previewUrl && (
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-full border-4 border-border"
              />
            </div>
            <p className="text-sm text-muted-foreground">Preview</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-border hover:border-slate-400 dark:hover:border-slate-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              {previewUrl ? (
                <Camera className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground mb-2">
              {previewUrl ? 'Choose a different photo' : 'Drag and drop your photo here'}
            </p>
            <p className="text-sm text-muted-foreground/60 mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Supports: JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedFile}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Check className="h-4 w-4 mr-2" />
            Save Photo
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageUploadModal