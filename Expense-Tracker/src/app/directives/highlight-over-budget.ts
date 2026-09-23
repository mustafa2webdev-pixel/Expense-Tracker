import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

@Directive({
    selector: '[appHighlightOverBudget]'
})
export class HighlightOverBudget implements OnChanges {

    el = inject(ElementRef);

    @Input('appHighlightOverBudget') amount: number = 0;
    @Input() threshold: number = 100;

    ngOnChanges(): void {
        if (this.amount > this.threshold) {
            this.el.nativeElement.style.backgroundColor = '#ffe1d6';
        } else {
            this.el.nativeElement.style.backgroundColor = '';
        }
    }
}
