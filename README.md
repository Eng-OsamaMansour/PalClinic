
# PalClinic

PalClinic is an AI-powered healthcare platform designed for clinics in Palestine, providing intelligent appointment scheduling, electronic medical records (EMR), and real-time tele-consultation capabilities.

---

## 🚀 Features

- **AI-Powered Scheduling**: Intelligent queue management and time-slot optimization.
- **Electronic Medical Records (EMR)**: Secure patient records with role-based access.
- **Consultation**: chat between patients and doctors.
- **AI Consultation: AI Chatbot for medical consultation.
- **Multi-Platform Support**: Web (React), Mobile (React Native), and REST API (Django DRF).
- **Location Services**: PostGIS for geographic queries (nearest clinics, directions).

---

## 🏗 Architecture

- **Backend**: Django REST Framework, Celery, Redis, PostgreSQL + PostGIS
- **Frontend**: React (Vite, React Router, Bootstrap)
- **Mobile**: React Native (Expo, AsyncStorage, Navigation Stack)
- **AI/ML**: RAG for data and Open AI API for LLM
- **Deployment**: Docker, Nginx, Gunicorn
- **Realtime**: Django Channels, WebSockets for real-time updates

![Architecture Diagram](docs/architecture-diagram.png)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Eng-OsamaMansour/PalClinic.git
cd PalClinic
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run migrations and create a superuser:
```bash
python manage.py migrate
python manage.py createsuperuser
```

Start backend server:
```bash
python manage.py runserver
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

### 4. Mobile App Setup (React Native)
```bash
cd mobile
npm install
npx expo start
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend folder with:
```
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgres://user:pass@localhost:5432/palclinic
REDIS_URL=redis://localhost:6379
```

---

## 🗄 Database Seeding

Use the provided seed scripts to populate test data:
```bash
python manage.py loaddata seed_data.json
```

---

## 📄 API Documentation

- Postman Collection: [PalClinic API Docs](docs/postman-collection.json)

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

This will start:
- Django API Server
- PostgreSQL + PostGIS
- Redis + Celery Worker
- React Frontend

---

## 📷 Screenshots

![Login Page](docs/screens/login.png)
![Dashboard](docs/screens/dashboard.png)
![Tele-Consultation](docs/screens/tele-consultation.png)

---

## 👥 Contributors

- **Osama Mansouer** - AI Engineer / Full Stack Developer
- **Team PalClinic** - Backend, Frontend, Mobile Developers

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for more information.
