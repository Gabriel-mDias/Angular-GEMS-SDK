import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, delay } from 'rxjs';
import { GemsFormCardComponent, GemsFileUploadComponent, GemsS3Service } from '@gabriel-mdias/angular-gems-sdk';
import { CodeSnippetComponent, CodeTab } from '../../../components/code-snippet';

class MockGemsS3Service {
  uploadFile(file: File, directory: string): Observable<string> {
    // Simulando um delay de rede de 2 segundos para fins de visualização
    return of('mock-file-key-' + file.name).pipe(delay(2000));
  }
}

@Component({
  selector: 'app-file-upload-page',
  standalone: true,
  imports: [CommonModule, GemsFormCardComponent, GemsFileUploadComponent, CodeSnippetComponent],
  providers: [
    { provide: GemsS3Service, useClass: MockGemsS3Service }
  ],
  template: `
    <div class="showcase-page fade-in">
      <div class="header">
        <div class="header-titles">
          <h2>File Upload</h2>
          <p class="subtitle">Componente para upload de arquivos com preview e progresso.</p>
        </div>
      </div>
      
      <div class="demo-section">
        <div class="demo-preview">
          <gems-form-card title="Upload de Documentos" icon="fa-solid fa-cloud-arrow-up">
            <div style="padding-bottom: 2rem;">
              <gems-file-upload
                label="Anexar Documento"
                accept=".pdf,.png,.jpg,.jpeg"
                (uploadSuccess)="onUploadSuccess($event)"
                (uploadError)="onUploadError($event)"
              ></gems-file-upload>
            </div>
            
            <div *ngIf="uploadedFileKey" class="file-list">
              <h4>Arquivo Enviado com Sucesso!</h4>
              <ul>
                <li>Chave: {{ uploadedFileKey }}</li>
              </ul>
            </div>
          </gems-form-card>
        </div>

        <div class="demo-code">
          <app-code-snippet [tabs]="codeTabs"></app-code-snippet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-list { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed #cbd5e1; }
    .file-list h4 { font-size: 0.9rem; color: #475569; margin-bottom: 0.5rem; }
    .file-list ul { margin: 0; padding-left: 1.5rem; color: #64748b; font-size: 0.85rem; }
  `]
})
export class FileUploadPageComponent {
  uploadedFileKey: string = '';

  onUploadSuccess(fileKey: string) {
    this.uploadedFileKey = fileKey;
  }

  onUploadError(error: any) {
    console.error('Erro de upload', error);
  }

  codeTabs: CodeTab[] = [
    {
      name: 'HTML',
      language: 'html',
      code: `<gems-file-upload
  label="Anexar Documento"
  accept=".pdf,.png,.jpg,.jpeg"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
</gems-file-upload>`
    },
    {
      name: 'TypeScript',
      language: 'typescript',
      code: `export class MinhaPagina {
  uploadedFileKey: string = '';

  onUploadSuccess(fileKey: string) {
    this.uploadedFileKey = fileKey;
  }
}`
    }
  ];
}
