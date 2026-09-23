import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Expenses } from '../Services/expenses';

@Component({
  imports: [ReactiveFormsModule, NgIf, NgFor],
  selector: 'app-expense-form',
  styleUrl: './expense-form.css',
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit {

  fb = inject(FormBuilder);
  expensesClass = inject(Expenses);
  route = inject(ActivatedRoute);
  router = inject(Router);

  categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

  editingId: string | null = null;

  form = this.fb.group({
    amount: [null as number | null, Validators.required],
    category: ['Food'],
    date: ['', Validators.required],
    note: [''],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');

        if (idParam) {
          this.editingId = idParam;
          this.display();
        } else {
          this.editingId = null;
          this.form.reset({ amount: null, category: 'Food', date: '', note: '' });
        }
      }
    });
  }

  display() {
    this.expensesClass.getExpenseByID(this.editingId!).subscribe({
      next: (res) => {
        console.log(res);
        this.form.patchValue(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const expense = {
      amount: Number(this.form.value.amount),
      category: this.form.value.category,
      date: this.form.value.date,
      note: this.form.value.note || '',
    };

    if (this.editingId) {
      this.expensesClass.updateExpense(this.editingId, expense).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/expenses']);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.expensesClass.addExpense(expense).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/expenses']);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/expenses']);
  }
}
