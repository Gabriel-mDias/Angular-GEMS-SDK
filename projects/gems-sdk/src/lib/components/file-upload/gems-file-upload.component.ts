import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GemsAlertService } from '../../services/alert/gems-alert.service';
import { GemsS3Service } from '../../services/s3/gems-s3.service';

/**
 * Componente de upload de arquivo com drag & drop, preview de estado e
 * integração automática com o GemsS3Service.
 */
@Component({
  selector: 'gems-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './gems-file-upload.component.html',
  styleUrls: ['./gems-file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GemsFileUploadComponent implements OnInit {
  // ── Inputs ────────────────────────────────────────────────────────
  readonly label = input<string>('Anexar Documento');
  readonly accept = input<string>('.pdf,.jpg,.jpeg');
  readonly directory = input<string>('documentos');
  readonly existingFileKey = input<string>();
  readonly existingFileName = input<string>();

  /** Textos internacionalizáveis */
  readonly uploadingText = input<string>('Enviando arquivo...');
  readonly dropText = input<string>('Arraste um arquivo até aqui ou');
  readonly browseText = input<string>('Navegue');
  readonly hintText = input<string>();
  /** Mensagem de erro de formato inválido. Recebe a lista de extensões aceitas. */
  readonly invalidFormatMessage = input<(accept: string) => string>(
    accept => `Formato inválido. Aceitos: ${accept}`,
  );
  /** Mensagem de sucesso do upload. Recebe o label. */
  readonly uploadSuccessMessage = input<(label: string) => string>(
    label => `${label} anexado com sucesso!`,
  );
  /** Mensagem de erro do upload. Recebe o label. */
  readonly uploadErrorMessage = input<(label: string) => string>(
    label => `Erro ao fazer upload: ${label}`,
  );

  private readonly destroyRef = inject(DestroyRef);

  // ── Outputs ───────────────────────────────────────────────────────
  readonly uploadSuccess = output<string>();
  readonly uploadError = output<Error>();

  // ── Estado interno ────────────────────────────────────────────────
  protected readonly isDragging = signal<boolean>(false);
  protected readonly isUploading = signal<boolean>(false);
  protected readonly isUploaded = signal<boolean>(false);
  protected readonly fileName = signal<string>('');

  // ── Construtor ────────────────────────────────────────────────────
  constructor(
    private readonly s3Service: GemsS3Service,
    private readonly alertService: GemsAlertService,
  ) {}

  // ── Ciclo de vida ─────────────────────────────────────────────────
  ngOnInit(): void {
    const key = this.existingFileKey();
    const name = this.existingFileName();
    if (key && name) {
      this.isUploaded.set(true);
      this.fileName.set(name);
    }
  }

  // ── Métodos públicos ──────────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  removeFile(): void {
    this.isUploaded.set(false);
    this.fileName.set('');
    this.uploadSuccess.emit('');
  }

  // ── Métodos privados ──────────────────────────────────────────────
  private handleFile(file: File): void {
    const validExtensions = this.accept()
      .split(',')
      .map(ext => ext.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension) && !this.accept().includes(file.type)) {
      this.alertService.error(this.invalidFormatMessage()(this.accept()));
      return;
    }

    this.isUploading.set(true);
    this.isUploaded.set(false);
    this.fileName.set(file.name);

    this.s3Service
      .uploadFile(file, this.directory())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fileKey: string) => {
          this.isUploading.set(false);
          this.isUploaded.set(true);
          this.alertService.success(this.uploadSuccessMessage()(this.label()));
          this.uploadSuccess.emit(fileKey);
        },
        error: (err: Error) => {
          this.isUploading.set(false);
          this.fileName.set('');
          this.alertService.error(this.uploadErrorMessage()(this.label()));
          this.uploadError.emit(err);
        },
      });
  }
}
