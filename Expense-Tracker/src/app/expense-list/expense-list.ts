import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Expenses } from '../Services/expenses';
import { iExpense } from '../interfaces/iExpense';
import { CategoryIcon } from '../pipes/category-icon';
import { HighlightOverBudget } from '../directives/highlight-over-budget';

@Component({
  imports: [NgFor, NgIf, CurrencyPipe, CategoryIcon, HighlightOverBudget],
  selector: 'app-expense-list',
  styleUrl: './expense-list.css',
  templateUrl: './expense-list.html',
})
export class ExpenseList implements OnInit {

  expensesClass = inject(Expenses);
  router = inject(Router);

  categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  expensesArr = signal<iExpense[] | undefined>(undefined);

  selectedCategory = 'All';
  searchText = '';
  sortBy = 'date';
  sortDir = 'desc';

  ngOnInit(): void {
    this.display();
  }

  display() {
    this.expensesClass.getAllExpenses().subscribe({
      next: (res) => {
        console.log(res);
        this.expensesArr.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getFilteredExpenses(): iExpense[] {
    let list = this.expensesArr() ?? [];

    if (this.selectedCategory !== 'All') {
      list = list.filter(e => e.category === this.selectedCategory);
    }

    if (this.searchText.trim() !== '') {
      const term = this.searchText.trim().toLowerCase();
      list = list.filter(e => (e.note || '').toLowerCase().includes(term));
    }

    list = [...list].sort((a, b) => {
      let result = 0;
      if (this.sortBy === 'amount') {
        result = a.amount - b.amount;
      } else {
        result = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return this.sortDir === 'asc' ? result : -result;
    });

    return list;
  }

  getTotal(): number {
    let total = 0;
    for (let e of this.getFilteredExpenses()) {
      total += e.amount;
    }
    return total;
  }

  onCategoryChange(value: string) {
    this.selectedCategory = value;
  }

  onSearchChange(value: string) {
    this.searchText = value;
  }

  onSortByChange(value: string) {
    this.sortBy = value;
  }

  toggleSortDir() {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
  }

  onEdit(id: string) {
    this.router.navigate(['/edit', id]);
  }

  onDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    this.expensesClass.deleteExpense(id).subscribe({
      next: (res) => {
        console.log(res);
        this.display();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
