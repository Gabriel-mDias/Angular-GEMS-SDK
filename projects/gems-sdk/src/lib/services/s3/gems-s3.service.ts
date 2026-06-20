import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { GemsS3Store } from './gems-s3.store';
import { GemsGenerateUploadUrlRequestDTO, GemsPresignedUrlResponseDTO } from './gems-s3.models';

@Injectable({
  providedIn: 'root'
})
export class GemsS3Service {
  private readonly bypassHttp: HttpClient;

  constructor(
    private readonly s3Store: GemsS3Store,
    private readonly handler: HttpBackend
  ) {
    this.bypassHttp = new HttpClient(this.handler);
  }

  uploadFile(file: File, directory?: string): Observable<string> {
    const request: GemsGenerateUploadUrlRequestDTO = {
      fileName: file.name,
      contentType: file.type,
      directory
    };

    return this.s3Store.generateUploadUrl(request).pipe(
      switchMap((response: GemsPresignedUrlResponseDTO) => {
        const headers = new HttpHeaders({
          'Content-Type': file.type
        });

        return new Observable<string>((observer) => {
          this.bypassHttp.put(response.url, file, { headers }).subscribe({
            next: () => {
              observer.next(response.fileKey);
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        });
      })
    );
  }
}
