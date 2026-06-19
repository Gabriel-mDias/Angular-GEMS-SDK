import { Injectable } from '@angular/core';

export interface PacienteState {
  nome: string;
  cpf: string;
  dataNascimento: string;
  cep: string;
  logradouro: string;
  numero: string;
}

@Injectable({ providedIn: 'root' })
export class PatientStateService {
  state: PacienteState = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    cep: '',
    logradouro: '',
    numero: ''
  };

  updatePersonal(data: Partial<PacienteState>) {
    this.state = { ...this.state, ...data };
  }

  updateAddress(data: Partial<PacienteState>) {
    this.state = { ...this.state, ...data };
  }

  clear() {
    this.state = {
      nome: '',
      cpf: '',
      dataNascimento: '',
      cep: '',
      logradouro: '',
      numero: ''
    };
  }
}
