import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { iExpense } from '../interfaces/iExpense';

@Injectable({
    providedIn: 'root'
})
export class Expenses {

    httpClient = inject(HttpClient);

    getAllExpenses(): Observable<iExpense[]> {
        return this.httpClient.get<iExpense[]>('http://localhost:3000/expenses');
    }

    getExpenseByID(id: string) {
        return this.httpClient.get<iExpense>('http://localhost:3000/expenses/' + id);
    }

    addExpense(expense: any) {
        return this.httpClient.post('http://localhost:3000/expenses', expense);
    }

    updateExpense(id: string, expense: any) {
        return this.httpClient.put('http://localhost:3000/expenses/' + id, expense);
    }

    deleteExpense(id: string) {
        return this.httpClient.delete('http://localhost:3000/expenses/' + id);
    }

}
