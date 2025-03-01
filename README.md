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
📦 opendata-fn
 ┣ 📂 src/
 ┃ ┣ 📂 assets/           # Static assets (images, fonts, etc.)
 ┃ ┣ 📂 components/       # Reusable UI components
 ┃ │   ┣ 📂 Common/        # Common, shared components
 ┃ │   │   ┣ 📜 Button.jsx
 ┃ │   │   ┣ 📜 Input.jsx
 ┃ │   │   └ 📜 ...
 ┃ │   ┣ 📂 FeatureA/      # Components specific to Feature A
 ┃ │   │   ┣ 📜 FeatureAComponent.jsx
 ┃ │   │   ┣ 📜 FeatureAForm.jsx
 ┃ │   │   └ 📜 ...
 ┃ │   ┣ 📂 FeatureB/      # Components specific to Feature B
 ┃ │   │   ┣ 📜 FeatureBList.jsx
 ┃ │   │   ┣ 📜 FeatureBDetails.jsx
 ┃ │   │   └ 📜 ...
 ┃ │   └ 📜 ...
 ┃ ┣ 📂 contexts/         # React Contexts for state management
 ┃ │   ┣ 📜 AuthContext.jsx
 ┃ │   ┣ 📜 ThemeContext.jsx
 ┃ │   └ 📜 ...
 ┃ ┣ 📂 hooks/            # Custom React hooks
 ┃ │   ┣ 📜 useFetch.jsx
 ┃ │   ┣ 📜 useForm.jsx
 ┃ │   └ 📜 ...
 ┃ ┣ 📂 pages/            # Page-level components (route handlers)
 ┃ │   ┣ 📜 HomePage.jsx
 ┃ │   ┣ 📜 LoginPage.jsx
 ┃ │   ┣ 📜 FeatureAPage.jsx
 ┃ │   ┣ 📜 FeatureBPage.jsx
 ┃ │   └ 📜 ...
 ┃ ┣ 📂 services/         # API service layer
 ┃ │   ┣ 📂 api/          # API infrastructure
 ┃ │   │   ┣ 📜 client.jsx    # Core axios client with interceptors
 ┃ │   │   ┣ 📜 endpoints.jsx # Constants for all API endpoints
 ┃ │   │   └ 📜 index.jsx     # Exports from the api directory
 ┃ │   ┣ 📂 resources/    # Resource-specific API calls
 ┃ │   │   ┣ 📜 auth.jsx      # Authentication API calls
 ┃ │   │   ┣ 📜 restaurants.jsx # Restaurant API calls
 ┃ │   │   ┣ 📜 hotels.jsx    # Hotels API calls
 ┃ │   │   └ 📜 ...
 ┃ ┣ 📂 utils/            # Utility functions
 ┃ │   ┣ 📜 helpers.jsx   # Helper functions
 ┃ │   ┣ 📜 errorHandlers.jsx # Error handling utilities
 ┃ │   ┣ 📜 validation.jsx # Validation functions
 ┃ │   └ 📜 ...
 ┃ ┣ 📜 App.jsx           # Main application component
 ┃ ┣ 📜 main.jsx          # Entry point
 ┃ ┣ 📜 index.css         # Global styles
 ┣ 📂 public/              # Public assets (static files served directly)
 ┃ └ 📜 index.html
 ┣ 📜 .env                 # Environment variables
 ┣ 📜 package.json
 ┣ 📜 vite.config.js
 ┗ 📜 README.md
```

## API Service Layer Organization

The services directory is organized to handle API calls efficiently:

### 1. API Infrastructure (`services/api/`)

- **client.jsx**: Sets up the Axios instance with:
  - Base URL configuration
  - Request interceptors for authentication
  - Response interceptors for global error handling
  - Default headers and timeout settings

- **endpoints.jsx**: Centralizes all API endpoint URLs as constants for:
  - Consistent usage across the application
  - Easy updates when endpoints change
  - Support for dynamic parameters (e.g., `DETAIL: (id) => `/resource/${id}/`)

### 2. Resource-Specific Services (`services/resources/`)

Each file corresponds to a specific data domain and implements functions for:
- Fetching lists of resources
- Getting details for a single resource
- Creating/updating/deleting resources
- Other specific operations for that resource type

Example (conceptual, not implementation):
```javascript
// restaurants.jsx
export const getRestaurants = async (params) => { /* implementation */ };
export const getRestaurantById = async (id) => { /* implementation */ };
export const createRestaurant = async (data) => { /* implementation */ };
```

## Error Handling Strategy

Error handling is centralized in the `utils/errorHandlers.jsx` file:

### 1. Centralized Error Processing

The API client's response interceptor processes all error responses:
- Standardizes error format across the application
- Handles common HTTP status codes (400, 401, 403, 404, etc.)
- Extracts meaningful error messages from the API response
- Manages authentication failures (e.g., token expiration)

### 2. Error Display Methods

Errors are displayed to users through:
- Toast notifications for general errors
- Form-specific error messages for validation errors
- Global error boundaries for unexpected errors
- Custom error pages for specific error types (404, 500, etc.)

### 3. Error Usage in Components

Components can handle errors from API calls:
```javascript
// Example usage (conceptual)
try {
  const data = await getRestaurants();
  // Handle success case
} catch (error) {
  // Access standardized error properties
  if (error.statusCode === 404) {
    // Show not found message
  }
  
  // For form errors
  const fieldErrors = formatFormErrors(error);
  // Update form state with errors
}
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