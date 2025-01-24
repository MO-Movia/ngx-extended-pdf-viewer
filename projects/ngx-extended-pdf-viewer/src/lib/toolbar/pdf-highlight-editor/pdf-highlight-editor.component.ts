import { ChangeDetectorRef, Component, HostListener, Input, effect } from '@angular/core';
import { AnnotationEditorEditorModeChangedEvent } from '../../events/annotation-editor-mode-changed-event';
import { IPDFViewerApplication } from '../../options/pdf-viewer-application';
import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';

@Component({
  selector: 'pdf-highlight-editor',
  templateUrl: './pdf-highlight-editor.component.html',
  styleUrls: ['./pdf-highlight-editor.component.css'],
})
export class PdfHighlightEditorComponent {
  @Input()
  public show: ResponsiveVisibility = true;

  public isSelected = false;

  private PDFViewerApplication: IPDFViewerApplication | undefined;

  constructor(private notificationService: PDFNotificationService, private cdr: ChangeDetectorRef) {
    effect(() => {
      this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
      if (this.PDFViewerApplication) {
        this.onPdfJsInit();
      }
    });
  }

  private onPdfJsInit() {
    this.PDFViewerApplication?.eventBus.on('annotationeditormodechanged', ({ mode }: AnnotationEditorEditorModeChangedEvent) => {
      setTimeout(() => {
        this.isSelected = mode === 9;
        this.cdr.detectChanges();
      });
    });
  }

  public onClick(): void {
    document.getElementById('editorHighlight')?.click();
  }
  @HostListener('document:keydown.alt.e', ['$event'])
  public handleOnClick(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onClick();
  }
}
