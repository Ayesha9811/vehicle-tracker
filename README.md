# 🚗 Vehicle Tracker Dashboard

A modern, highly-responsive web application designed for comprehensive fleet and individual vehicle management. Built with scale, modularity, and smooth user experience in mind, this project organizes all technical tracking aspects, operational logging, and financial expenditures seamlessly behind single-page smart modal forms.

## 🌟 Key Features

* **Vehicle Management:** Full-featured grid displaying registered vehicles with technical criteria (tank capacity, OEM specs, mileage).
* **Journeys & Running Chart:** Tracks driver trips with integrated **Geolocation capabilities** to dynamically plot locations, alongside intelligent **image OCR** using `tesseract.js` to calculate distance from snapped odometer dashboard photos.
* **Fuel Logging:** Automatically generates L/km efficiency, cost breakdowns, and graphical analytical tracking.
* **Document Vault & Reminders:** Handles sensitive data management natively with 14-day tracking metrics for insurance and renewal alerting.
* **Expense & Maintenance Ledgers:** Unified tables mapping vehicle-linked cost items (Upgrades, tires, fines, core maintenance).

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Styling:** TailwindCSS 
- **Icons:** Lucide React
- **Data Persistence:** Modular `localStorage` utilities mimicking typical DB behaviors
- **Advanced Integrations:** OpenStreetMap Nominatim Reverse Geocoding API & Tesseract.js (In-browser Optical Character Recognition)

## 🚀 Getting Started

### Option 1: Native Local Development

First, navigate to the `frontend` directory and install the necessary dependencies:

```bash
cd frontend
npm install
```

Launch the Vite development server:

```bash
npm run dev
```
Access the local development dashboard at `http://localhost:5173`.

### Option 2: Production Docker Deployment 🔥

This project is tuned specifically for secure production deployment serving static bundles over an Nginx interface.

1. Ensure Docker Desktop is active on your host machine.
2. Navigate into the `frontend` context and synthesize your multi-stage container:
    ```bash
    cd frontend
    docker build -t vehicle-tracker .
    ```
3. Boot the finalized internal Nginx server and dynamically map port `80` to local port `8081` in isolated detached mode:
    ```bash
    docker run -d -p 8081:80 --name vehicle-dashboard vehicle-tracker
    ```
4. Access the production server at `http://localhost:8081`.

---
*Developed for intelligent, private fleet administration.*
