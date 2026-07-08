import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { GemsInputMaskComponent, GemsFormCardComponent } from '@gabriel-mdias/angular-gems-sdk';
import { PatientStateService, PacienteState } from '../patient-state.service';

@Component({
  selector: 'app-step-address',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GemsInputMaskComponent,
    GemsFormCardComponent,
  ],
  templateUrl: './step-address.component.html',
  styles: [``],
})
export class StepAddressComponent {
  next = output<void>();
  prev = output<void>();
  state: PacienteState;
  form: FormGroup;

  constructor(
    private patientService: PatientStateService,
    private fb: FormBuilder,
  ) {
    this.state = this.patientService.state;
    this.form = this.fb.group({
      cep: [this.state.cep, Validators.required],
      logradouro: [this.state.logradouro, Validators.required],
      numero: [this.state.numero, Validators.required],
    });
  }

  onNext() {
    if (this.form.invalid) return;
    this.patientService.updateAddress(this.form.value);
    this.next.emit();
  }

  onPrev() {
    this.patientService.updateAddress(this.state);
    this.prev.emit();
  }
}
