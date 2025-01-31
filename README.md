**Task Tracker Application**

The README.md file is a documentation file that provides instructions on how to run, and use your application. It helps others (or even yourself in the future) start the development server.

What to Include in README.md?

Here’s a structured template for your Task Tracker Application:

Introduction

Features

Technologies Used

Running the Application

Instructions

State Management

Error Handling

---

Introduction

Task Tracker is a web application built with Angular that allows users to create, update, delete, and filter tasks.
It demonstrates state management, API integration, form validation, and responsive UI design.

---

Features

✔️ Create, update, and delete tasks
✔️ Filter tasks by status and due date
✔️ Responsive design (desktop & mobile)
✔️ State management using RxJS or NgRx
✔️ Mock API with JSON Server
✔️ Form validation with Angular Reactive Forms
---

Technologies Used

Frontend: Angular 19, TypeScript, Angular Material

State Management: RxJS BehaviorSubject / NgRx

Mock API: JSON Server

Styling: CSS, Angular Material, Bootstrap

---

Running the Application

The app will be available at: https://crownz3.github.io/task-tracker

---

Instructions:

Adding a Task: Navigate to the "Add Task" page, fill in the required fields, and submit the form.

Viewing Tasks: The task list page displays all tasks with options to filter by status and due date.

Updating a Task: Click the edit button next to a task to modify its details.

Deleting a Task: Click the delete button to remove a task from the list.

---

State Management

This app manages state using RxJS BehaviorSubject (or NgRx, if implemented). The task list updates in real time as changes occur.

---
Error Handling

API errors are handled with user-friendly messages.

Form validations ensure required fields are filled, and due dates are not in the past.

