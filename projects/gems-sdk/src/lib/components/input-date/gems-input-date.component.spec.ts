import { TestBed } from '@angular/core/testing';

import { GemsInputDateComponent } from './gems-input-date.component';

describe('GemsInputDateComponent accessibility', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [GemsInputDateComponent] }));

  it('gives the native date picker the visible field label', () => {
    const fixture = TestBed.createComponent(GemsInputDateComponent);
    fixture.componentRef.setInput('id', 'birth-date');
    fixture.componentRef.setInput('label', 'Data de nascimento');
    fixture.detectChanges();

    const visibleLabel = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const nativeInput = fixture.nativeElement.querySelector(
      '.gems-hidden-native-input',
    ) as HTMLInputElement;

    expect(visibleLabel.htmlFor).toBe('birth-date');
    expect(nativeInput.getAttribute('aria-label')).toBe('Data de nascimento');
  });

  it('keeps an accessible name when the visual label is empty', () => {
    const fixture = TestBed.createComponent(GemsInputDateComponent);
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    const nativeInput = fixture.nativeElement.querySelector(
      '.gems-hidden-native-input',
    ) as HTMLInputElement;

    expect(nativeInput.getAttribute('aria-label')).toBe('Data');
  });
});
