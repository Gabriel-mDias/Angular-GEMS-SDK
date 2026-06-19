import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GemsS3Service } from '../../services/s3/gems-s3.service';
import { GemsAlertService } from '../../services/alert/gems-alert.service';

@Component({
  selector: 'gems-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gems-file-upload-container">
      <label class="gems-file-upload-label" *ngIf="label()">{{ label() }}</label>
      
      <div *ngIf="isUploading()" class="gems-upload-skeleton">
        <div class="gems-spinner"></div>
        <span>Enviando arquivo...</span>
      </div>

      <div *ngIf="isUploaded() && !isUploading()" class="gems-upload-success">
        <div class="gems-success-info">
          <i class="fa-solid fa-file-circle-check gems-success-icon"></i>
          <span class="gems-file-name">{{ fileName() }}</span>
        </div>
        <button type="button" class="gems-btn-remove" (click)="removeFile()" title="Remover">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div *ngIf="!isUploading() && !isUploaded()" 
           class="gems-upload-dropzone" 
           [class.gems-dragover]="isDragging()"
           (dragover)="onDragOver($event)" 
           (dragleave)="onDragLeave($event)" 
           (drop)="onDrop($event)">
        
        <div class="gems-dropzone-content">
          <i class="fa-solid fa-cloud-arrow-up gems-drop-icon"></i>
          <span class="gems-drop-text">Arraste um arquivo até aqui ou</span>
          <label class="gems-btn-browse">
            Navegue
            <input type="file" [accept]="accept()" (change)="onFileSelected($event)" class="gems-file-input" hidden>
          </label>
          <span class="gems-hint-text">Apenas {{ accept() }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./gems-file-upload.component.css']
})
export class GemsFileUploadComponent {
  label = input<string>('Anexar Documento');
  accept = input<string>('.pdf,.jpg,.jpeg');
  directory = input<string>('documentos');
  
  existingFileKey = input<string>();
  existingFileName = input<string>();

  uploadSuccess = output<string>();
  uploadError = output<any>();

  isDragging = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  isUploaded = signal<boolean>(false);
  fileName = signal<string>('');

  private s3Service = inject(GemsS3Service);
  private alertService = inject(GemsAlertService);

  constructor() {
    // We could use an effect to react to existingFileKey, but this is simpler
    // and standard input handling.
    // In Angular 20 we'd use effect or just set it on init if the inputs are available.
    // Let's use standard OnInit.
  }

  ngOnInit() {
    const efk = this.existingFileKey();
    const efn = this.existingFileName();
    if (efk && efn) {
      this.isUploaded.set(true);
      this.fileName.set(efn);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    const validExtensions = this.accept().split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension) && !this.accept().includes(file.type)) {
      this.alertService.error(`Formato inválido. Aceitos: ${this.accept()}`);
      return;
    }

    this.isUploading.set(true);
    this.isUploaded.set(false);
    this.fileName.set(file.name);

    this.s3Service.uploadFile(file, this.directory()).subscribe({
      next: (fileKey: string) => {
        this.isUploading.set(false);
        this.isUploaded.set(true);
        this.alertService.success(`${this.label()} anexado com sucesso!`);
        this.uploadSuccess.emit(fileKey);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.fileName.set('');
        this.alertService.error(`Erro ao fazer upload do documento: ${this.label()}`);
        this.uploadError.emit(err);
      }
    });
  }

  removeFile() {
    this.isUploaded.set(false);
    this.fileName.set('');
    this.uploadSuccess.emit('');
  }
}
