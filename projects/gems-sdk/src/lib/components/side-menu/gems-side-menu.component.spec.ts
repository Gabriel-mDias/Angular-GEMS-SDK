import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GemsSideMenuComponent } from './gems-side-menu.component';

describe('GemsSideMenuComponent accessibility', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [GemsSideMenuComponent],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: 'server' }],
    }),
  );

  it('names the collapse control for its current action and supports Enter and Space', () => {
    const fixture = TestBed.createComponent(GemsSideMenuComponent);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.menu-footer') as HTMLDivElement;

    expect(footer.getAttribute('aria-label')).toBe('Recolher menu');

    footer.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(footer.getAttribute('aria-label')).toBe('Expandir menu');

    footer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(footer.getAttribute('aria-label')).toBe('Recolher menu');
  });
});
