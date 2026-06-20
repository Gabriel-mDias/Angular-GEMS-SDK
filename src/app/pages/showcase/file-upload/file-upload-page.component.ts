import { Component } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

import { GemsFormCardComponent, GemsFileUploadComponent, GemsS3Service } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

/** Mock do serviço S3 para fins de demonstração. */
class MockGemsS3Service {
  uploadFile(file: File, _directory: string): Observable<string> {
    return of('mock-file-key-' + file.name).pipe(delay(2000));
  }
}

@Component({
  selector: 'app-file-upload-page',
  standalone: true,
  imports: [GemsFormCardComponent, GemsFileUploadComponent, CodeSnippetComponent],
  providers: [{ provide: GemsS3Service, useClass: MockGemsS3Service }],
  templateUrl: './file-upload-page.component.html',
  styleUrls: ['./file-upload-page.component.css'],
})
export class FileUploadPageComponent {
  // ── Estado interno ────────────────────────────────────────────────
  uploadedFileKey = '';

  // ── Estado derivado ───────────────────────────────────────────────
  readonly codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<!-- Registre GemsS3Service no provider da página ou app.config -->
<gems-file-upload
  label="Anexar Documento"
  accept=".pdf,.png,.jpg,.jpeg"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
</gems-file-upload>`,
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `// app.config.ts
import { provideGemsTheme } from '@gabriel-mdias/angular-gems-sdk';
// ...

// MinhaPagina
export class MinhaPagina {
  uploadedFileKey = '';

  onUploadSuccess(fileKey: string): void {
    this.uploadedFileKey = fileKey;
  }

  onUploadError(error: Error): void {
    console.error('Erro de upload', error);
  }
}`,
    },
  ];

  // ── Métodos públicos ──────────────────────────────────────────────
  onUploadSuccess(fileKey: string): void {
    this.uploadedFileKey = fileKey;
  }

  onUploadError(error: Error): void {
    console.error('Erro de upload', error);
  }
}
