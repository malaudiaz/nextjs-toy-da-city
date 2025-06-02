import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

// Crear directorio si no existe
export async function ensureUploadsDir() {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating uploads directory:', error)
    throw error
  }
}

// Subir archivo y devolver URL
export async function handleFileUpload(file: File): Promise<string> {
  await ensureUploadsDir()
  
  const extension = file.name.split('.').pop()
  const filename = `${uuidv4()}.${extension}`
  const filePath = join(UPLOADS_DIR, filename)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)
    return `/uploads/${filename}`
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

// Eliminar archivo
export async function deleteUploadedFile(fileUrl: string) {
  try {
    const filename = fileUrl.split('/uploads/')[1]
    if (filename) {
      await unlink(join(UPLOADS_DIR, filename))
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
