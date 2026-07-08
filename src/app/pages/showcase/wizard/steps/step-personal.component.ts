import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  GemsInputDocumentComponent,
  GemsInputDateComponent,
  GemsFormCardComponent,
} from '@gabriel-mdias/angular-gems-sdk';
import { PatientStateService, PacienteState } from '../patient-state.service';

@Component({
  selector: 'app-step-personal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GemsInputDocumentComponent,
    GemsInputDateComponent,
    GemsFormCardComponent,
  ],
  templateUrl: './step-personal.component.html',
  styles: [``],
})
export class StepPersonalComponent {
  next = output<void>();
  state: PacienteState;
  form: FormGroup;

  constructor(
    private patientService: PatientStateService,
    private fb: FormBuilder,
  ) {
    this.state = this.patientService.state;
    this.form = this.fb.group({
      nome: [this.state.nome, Validators.required],
      cpf: [this.state.cpf, Validators.required],
      dataNascimento: [this.state.dataNascimento, Validators.required],
    });
  }

  onNext() {
    if (this.form.invalid) return;
    this.patientService.updatePersonal(this.form.value);
    this.next.emit();
  }
}
