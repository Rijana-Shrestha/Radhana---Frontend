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
  const [imagePreviews, setImagePreviews] = React.useState(multiple ? (Array.isArray(image) ? image : []) : image)

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return

    if (multiple) {
      // Handle multiple files
      const fileArray = Array.from(files)
      const previews = []
      let filesProcessed = 0

      fileArray.forEach((file) => {
        if (file.type.startsWith('image/')) {
          if (returnFile) {
            previews.push(file)
          } else {
            const reader = new FileReader()
            reader.onload = (e) => {
              previews.push(e.target.result)
              filesProcessed++
              if (filesProcessed === fileArray.length) {
                setImagePreviews(previews)
                onImageChange(previews)
              }
            }
            reader.readAsDataURL(file)
          }
        }
      })

      if (returnFile) {
        setImagePreviews(previews)
        onImageChange(previews)
      }
    } else {
      // Handle single file
      const file = files[0]
      if (file) {
        if (returnFile) {
          onImageChange(file)
          const reader = new FileReader()
          reader.onload = (e) => {
            setImagePreviews(e.target.result)
          }
          reader.readAsDataURL(file)
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            setImagePreviews(e.target.result)
            onImageChange(e.target.result)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files) {
      handleFileSelect(files)
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
    
    const files = e.dataTransfer.files
    if (files) {
      handleFileSelect(files)
    }
  }

  const handleClear = (index = null) => {
    if (multiple && index !== null) {
      // Remove specific file from multiple
      const newPreviews = imagePreviews.filter((_, i) => i !== index)
      setImagePreviews(newPreviews)
      onImageChange(newPreviews)
    } else {
      // Clear all
      setImagePreviews(multiple ? [] : null)
      onImageChange(multiple ? [] : null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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

      {preview && (multiple ? (Array.isArray(imagePreviews) && imagePreviews.length > 0) : imagePreviews) ? (
        <div className="w-full">
          {multiple ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50">
                      <img
                        src={typeof preview === 'string' ? preview : (preview instanceof File ? URL.createObjectURL(preview) : preview)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleClear(index)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">Image {index + 1}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-primary-600 hover:bg-primary-50 transition flex items-center justify-center cursor-pointer group"
                  title="Add more images"
                >
                  <div className="text-center">
                    <Upload className="mx-auto mb-1 text-gray-400 group-hover:text-primary-600" size={20} />
                    <p className="text-xs text-gray-500 group-hover:text-primary-600">Add</p>
                  </div>
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleClear()}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition text-sm"
              >
                Clear All
              </button>
            </div>
          ) : (
            <div className="relative inline-block w-full">
              <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50">
                <img
                  src={imagePreviews}
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
                    onClick={() => handleClear()}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
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
