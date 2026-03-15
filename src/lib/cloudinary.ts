export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  
  // Pulling from .env.local
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials are not configured in environment variables');
  }

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // This will help you see if the 'Unknown API Key' error persists due to config
      console.error('Cloudinary API Error:', errorData);
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url; 
  } catch (error) {
    console.error('Cloudinary Upload Utility Error:', error);
    throw error;
  }
};