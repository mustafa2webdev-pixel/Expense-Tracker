import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'categoryIcon'
})
export class CategoryIcon implements PipeTransform {

    transform(category: string): string {
        if (category === 'Food') return '🍔 ' + category;
        if (category === 'Transport') return '🚗 ' + category;
        if (category === 'Shopping') return '🛍️ ' + category;
        if (category === 'Bills') return '💡 ' + category;
        if (category === 'Entertainment') return '🎬 ' + category;
        return '📦 ' + category;
    }
}
