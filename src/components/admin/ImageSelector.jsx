import React, { useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

const ImageSelector = ({ 
  image, 
  onImageChange, 
  label = 'Image',
  multiple = false,
  preview = true,
  returnFile = false 
}) => {
  const fileInputRef = useRef(null)
  const dragRef = useRef(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState(image)

  const handleFileSelect = (file) => {
    if (file) {
      if (returnFile) {
        // Return the File object directly
        onImageChange(file)
        // Still create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        // Convert to base64 data URI
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
          onImageChange(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleClear = () => {
    setImagePreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        multiple={multiple}
        className="hidden"
      />

      {preview && imagePreview ? (
        <div className="relative inline-block w-full">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition"
                title="Change image"
              >
                <ImageIcon size={16} />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={dragRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragging
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:border-primary-600'
          }`}
        >
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-700 font-medium">
            {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}

      {image && typeof image === 'string' && image.startsWith('http') && !imagePreview && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Current image:</p>
          <img
            src={image}
            alt="Current"
            className="max-w-xs h-20 object-cover rounded-lg border border-gray-300"
            onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%2780%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27100%27 height=%2780%27/%3E%3C/svg%3E'}
          />
        </div>
      )}
    </div>
  )
}

export default ImageSelector
