# ProjectHub 🚀

Welcome to **ProjectHub**, a web application designed to streamline the management, submission, and review of final year projects for students, supervisors, and administrators in an academic environment. It supports an iterative submission process, supervisor feedback, and a searchable database of approved projects.

---

## ✨ Features

- **User Roles**:
  - **Students**: Submit projects, track progress, and view feedback.
  - **Supervisors**: Review submissions, provide feedback, and approve projects.
  - **Administrators**: Manage users, assign supervisors, and configure system settings.

- **Project Lifecycle**:
  - **Draft**: Initial work-in-progress by students.
  - **Submitted**: Ready for supervisor review.
  - **Under Review**: Supervisor evaluating the project.
  - **Approved**: Finalized and publicly searchable.

- **Key Functionalities**:
  - Upload projects with title, abstract, keywords, and files (PDF/Word, configurable max size).
  - Supervisors provide one feedback per submission version.
  - Search approved projects by keyword, title, author, or year.
  - Admin controls for user management and system settings.

- **Security**: JWT-based authentication with role-based access.

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js**: v14+ ([Download](https://nodejs.org/))
- **PostgreSQL**: v12+ ([Download](https://www.postgresql.org/))
- **npm**: Comes with Node.js
