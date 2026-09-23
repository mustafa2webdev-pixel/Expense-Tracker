import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Expenses } from '../Services/expenses';
import { API_Key } from '../secret-api/ai-key';

const AI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + API_Key;

@Component({
  imports: [NgFor, NgIf, FormsModule],
  selector: 'app-chatbot',
  styleUrl: './chatbot.css',
  templateUrl: './chatbot.html',
})
export class Chatbot {

  expensesClass = inject(Expenses);
  httpClient = inject(HttpClient);

  isOpen = signal(false);
  userInput = '';

  messages = signal([
    { from: 'ai', text: 'Ask me about any of the things above, or anything else about your expenses!' }
  ]);

  toggleOpen() {
    this.isOpen.set(!this.isOpen());
  }

  send() {
    const question = this.userInput.trim();
    if (question === '') return;

    this.messages.set([...this.messages(), { from: 'user', text: question }]);
    this.userInput = '';

    this.expensesClass.getAllExpenses().subscribe({
      next: (res) => {
        console.log(res);
        this.askAI(question, res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  askAI(question: string, expenses: any[]) {
    let context = 'You are an assistant inside an expense tracker app. Here is the user expenses as JSON: ' + JSON.stringify(expenses) + '. Answer the user question in one short sentence based on this data. Question: ' + question;

    const body = {
      contents: [
        { parts: [ { text: context } ] }
      ]
    };

    this.httpClient.post<any>(AI_URL, body).subscribe({
      next: (res) => {
        console.log(res);
        const answer = res.candidates[0].content.parts[0].text;
        this.messages.set([...this.messages(), { from: 'ai', text: answer }]);
      },
      error: (err) => {
        console.log(err);
        this.messages.set([...this.messages(), { from: 'ai', text: 'Something went wrong calling the AI.' }]);
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.send();
    }
  }
}