import { Component, input, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// @ts-ignore
import * as Prism from 'prismjs';
// Import some specific languages
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-scss';

export interface CodeTab {
  name: string;
  language: 'html' | 'css' | 'typescript' | 'json' | 'bash';
  code: string;
}

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="code-snippet-container">
      
      <!-- Tabs Header -->
      <div class="tabs-header" *ngIf="tabs().length > 1">
        <button 
          *ngFor="let tab of tabs(); let i = index" 
          type="button"
          class="tab-btn" 
          [class.active]="activeTabIndex() === i"
          (click)="selectTab(i)">
          {{ tab.name }}
        </button>
        <div class="tab-spacer"></div>
      </div>

      <!-- Code Area -->
      <div class="code-area">
        <button type="button" class="copy-btn" (click)="copyCode()" [title]="copied() ? 'Copiado!' : 'Copiar código'">
          <i class="fa-regular" [class.fa-copy]="!copied()" [class.fa-check]="copied()"></i>
        </button>

        <pre [ngClass]="'language-' + currentTab()?.language"><code #codeElement [ngClass]="'language-' + currentTab()?.language">{{ currentTab()?.code }}</code></pre>
      </div>

    </div>
  `,
  styleUrls: ['./code-snippet.component.css']
})
export class CodeSnippetComponent {
  tabs = input<CodeTab[]>([]);
  codeElement = viewChild<ElementRef<HTMLElement>>('codeElement');
  
  activeTabIndex = signal<number>(0);
  copied = signal<boolean>(false);

  constructor() {
    effect(() => {
      const el = this.codeElement();
      const current = this.currentTab();
      if (el && current) {
        // Use Prism.highlightElement instead of highlightAll to only highlight the current block
        setTimeout(() => Prism.highlightElement(el.nativeElement), 0);
      }
    });
  }

  get currentTab(): () => CodeTab | undefined {
    return () => this.tabs()[this.activeTabIndex()];
  }

  selectTab(index: number) {
    this.activeTabIndex.set(index);
    this.copied.set(false);
  }

  copyCode() {
    const code = this.currentTab()?.code;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
