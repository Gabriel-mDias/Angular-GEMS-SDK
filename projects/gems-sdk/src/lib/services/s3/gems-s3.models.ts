export interface GemsPresignedUrlResponseDTO {
  url: string;
  fileKey: string;
}

export interface GemsGenerateUploadUrlRequestDTO {
  fileName: string;
  contentType: string;
  directory?: string;
}
