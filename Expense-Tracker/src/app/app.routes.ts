import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ExpenseForm } from './expense-form/expense-form';
import { ExpenseList } from './expense-list/expense-list';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'add', component: ExpenseForm },
    { path: 'edit/:id', component: ExpenseForm },
    { path: 'expenses', component: ExpenseList },
];
