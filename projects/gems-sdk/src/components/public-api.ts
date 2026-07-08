/*
 * Public API — @gabriel-mdias/angular-gems-sdk/components
 *
 * Todos os componentes visuais da SDK GEMS e seus tipos públicos.
 */

// Botão
export { GemsButtonComponent } from '../lib/components/button/gems-button.component';
export { GemsButtonVariant } from '../lib/components/button/gems-button.model';

// Layout
export { GemsSideMenuComponent } from '../lib/components/side-menu/gems-side-menu.component';
export {
  GemsSideMenuConfig,
  GemsSideMenuItem,
} from '../lib/components/side-menu/gems-side-menu.config';
export { GemsFooterComponent } from '../lib/components/footer/gems-footer.component';
export { GemsFooterLink } from '../lib/components/footer/gems-footer.model';

// Data Display
export { GemsTableComponent } from '../lib/components/table/gems-table.component';
export {
  GemsTableColumn,
  GemsTableAction,
  GemsTableRow,
  GemsTableLabels,
} from '../lib/components/table/gems-table.model';
export { GemsSummaryCardComponent } from '../lib/components/summary-card/gems-summary-card.component';
export { GemsFormCardComponent } from '../lib/components/form-card/gems-form-card.component';
export { GemsCardListSelectComponent } from '../lib/components/card-list-select/gems-card-list-select.component';
export { GemsSelectItem } from '../lib/components/card-list-select/gems-card-list-select.model';

// Inputs
export { GemsInputPasswordComponent } from '../lib/components/input-password/gems-input-password.component';
export { GemsInputDateComponent } from '../lib/components/input-date/gems-input-date.component';
export {
  GemsDateFormat,
  GemsDateFormatLegacy,
  GemsDateFormatInput,
  gemsNormalizeDateFormat,
} from '../lib/components/input-date/gems-input-date.model';
export { GemsInputDocumentComponent } from '../lib/components/input-document/gems-input-document.component';
export { GemsDocumentType } from '../lib/components/input-document/gems-input-document.model';
export { GemsInputMaskComponent } from '../lib/components/input-mask/gems-input-mask.component';
export {
  GemsMaskType,
  GemsMaskTypeLegacy,
  GemsMaskTypeInput,
  gemsNormalizeMaskType,
} from '../lib/components/input-mask/gems-input-mask.model';
export { GemsInputRangeComponent } from '../lib/components/input-range/gems-input-range.component';
export { GemsRangeValue } from '../lib/components/input-range/gems-input-range.model';
export { GemsInputCheckboxComponent } from '../lib/components/input-checkbox/gems-input-checkbox.component';

// Upload
export { GemsFileUploadComponent } from '../lib/components/file-upload/gems-file-upload.component';

// Wizard
export { GemsWizardComponent } from '../lib/components/wizard/gems-wizard.component';
export { GemsWizardStep } from '../lib/components/wizard/gems-wizard.model';
export { GemsBaseStepComponent } from '../lib/components/wizard/gems-base-step.component';

// Loading
export { GemsLoadingComponent } from '../lib/components/loading/gems-loading.component';

// Novos componentes — Formulários
export { GemsInputTextComponent } from '../lib/components/input-text/gems-input-text.component';
export { GemsInputTextType } from '../lib/components/input-text/gems-input-text.model';
export { GemsSelectComponent } from '../lib/components/select/gems-select.component';
export {
  GemsSelectOption,
  GemsSelectCompareWith,
} from '../lib/components/select/gems-select.model';
export { GemsFieldErrorComponent } from '../lib/components/field-error/gems-field-error.component';
export { GemsErrorMessages } from '../lib/components/field-error/gems-field-error.model';
export { GemsTextareaComponent } from '../lib/components/textarea/gems-textarea.component';

// Novos componentes — Overlay / Feedback
export { GemsModalComponent } from '../lib/components/modal/gems-modal.component';
export { GemsModalSize } from '../lib/components/modal/gems-modal.model';
export { GemsToastContainerComponent } from '../lib/components/toast/gems-toast-container.component';
export { GemsToast, GemsToastType } from '../lib/components/toast/gems-toast.model';

// Novos componentes — Navegação / Layout
export { GemsTabsComponent } from '../lib/components/tabs/gems-tabs.component';
export { GemsTab } from '../lib/components/tabs/gems-tabs.model';

// Novos componentes — Exibição
export { GemsBadgeComponent } from '../lib/components/badge/gems-badge.component';
export { GemsBadgeVariant } from '../lib/components/badge/gems-badge.model';
export { GemsEmptyStateComponent } from '../lib/components/empty-state/gems-empty-state.component';
