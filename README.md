# DiversedataHub Frontend

## Overview
This is the frontend for the **DiversedataHub** platform, built using **React**. The application provides a user-friendly interface to interact with various types of data, including Restaurants, Hotels, Beauty Spas, Education, Health Services, and more. It consumes the Django REST Framework (DRF) backend API to fetch and display data efficiently.

## Tech Stack
- **React** (for UI components)
- **Vite** (for fast development and build tooling)
- **Bootstrap** (for styling and responsiveness)
- **Yarn** (as the package manager)

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (latest LTS version recommended)
- **Yarn** (Package Manager)
- **Git** (for version control)

## Installation
1. **Clone the repository**
   ```bash
   https://github.com/usanaphtal112/open-data-fn
   cd open-data-fn
   ```
2. **Install dependencies**
   ```bash
   yarn install
   ```
3. **Set up environment variables**
   - Create a `.env` file in the project root and configure your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1/
   ```
4. **Run the development server**
   ```bash
   yarn run dev
   ```
   - The app will be available at `http://localhost:5173/`.

## Project Structure
```
📦 diversedatahub-frontend
 ┣ 📂 src
 ┃ ┣ 📂 components  # Reusable UI components
 ┃ ┣ 📂 pages       # Page components (Dashboard, Listings, Details, etc.)
 ┃ ┣ 📂 services    # API interaction logic
 ┃ ┣ 📂 hooks       # Custom React hooks
 ┃ ┣ 📂 styles      # Global styles
 ┃ ┣ 📜 main.jsx    # Entry point
 ┃ ┣ 📜 App.jsx     # Main App component
 ┣ 📜 .env          # Environment variables
 ┣ 📜 vite.config.js # Vite configuration
 ┣ 📜 package.json   # Dependencies & scripts
 ┗ 📜 README.md      # Project documentation
```

## API Integration
This frontend interacts with a Django REST API. The `services/api.jsx` file handles API requests.

Example API call using **Axios**:
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchListings = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listings/?category=${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
};
```

## Styling with Bootstrap
The project uses Bootstrap for styling. Ensure Bootstrap is installed:
```bash
yarn add bootstrap
```
Import Bootstrap in `main.jsx`:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

## Running Tests
To run tests, use:
```bash
yarn test
```

## Build for Production
To create an optimized build:
```bash
yarn build
```
The build files will be generated in the `dist/` folder.

## Deployment
You can deploy this app using **Netlify**, **Vercel**, or any static hosting service. Example deployment to Netlify:
```bash
netlify deploy
```

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature.
3. Commit and push changes.
4. Open a Pull Request (PR).

## License
This project is licensed under the MIT License.

