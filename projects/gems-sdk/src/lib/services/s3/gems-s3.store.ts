import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GemsBaseStore } from '../../http/gems-base-store';
import { GemsGenerateUploadUrlRequestDTO, GemsPresignedUrlResponseDTO } from './gems-s3.models';

@Injectable({
  providedIn: 'root'
})
export class GemsS3Store extends GemsBaseStore {
  constructor() {
    super('/api/aws/s3');
  }

  generateUploadUrl(request: GemsGenerateUploadUrlRequestDTO): Observable<GemsPresignedUrlResponseDTO> {
    return this.post<GemsPresignedUrlResponseDTO>('/generate-upload-url', request);
  }

  generateDownloadUrl(fileKey: string): Observable<GemsPresignedUrlResponseDTO> {
    return this.get<GemsPresignedUrlResponseDTO>(`/generate-download-url`, {
      params: { fileKey }
    });
  }

  deleteFile(fileKey: string): Observable<void> {
    return this.delete<void>(`/delete-file`, {
      params: { fileKey }
    });
  }
}
