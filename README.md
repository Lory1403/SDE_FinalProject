# Mountain Hiking Planning

## Useful Links

- GitHub [repository](https://github.com/Lory1403/SDE_FinalProject)
- Demo site hosted on [vercel.app](https://sde-final-project.vercel.app/)
- Postman API [documentation](https://red-firefly-165054.postman.co/workspace/SDE_Final_Project~be929b52-9654-448c-aacb-aaec178518c9/collection/27249390-87d4ade2-e420-4174-af7d-d44a12ac7b98?action=share&creator=41994227)

## Overview
Mountain Hiking Planning is a web application designed for hiking and mountain trekking enthusiasts. It allows users to visualize existing trails, create new ones, and access reliable, community-maintained trail data. The platform ensures frequent updates and high reliability.

## Features
### Frontend
- **Trail Visualization**: Interactive map displaying available trails, with elevation profiles and real-time weather updates.
- **Trail Creation**: Users can create new trails by selecting start and end points on the map. The system calculates route details like elevation gain, estimated travel time, and difficulty level.
- **Saved Trails**: Users can view and manage previously saved trails.

### Backend
- **Trail Management**: RESTful APIs for CRUD operations on trails.
- **User Authentication**: Secure login using JWT authentication.
- **Database Storage**: NoSQL MongoDB database to store trail details and user data.

## Technologies Used
### Frontend
- **Vue.js**: UI development.
- **Vue Router**: Navigation handling.
- **Axios**: HTTP client for API communication.
- **Leaflet**: Interactive maps.
- **Chart.js + vue3-charts**: Data visualization.

### Backend
- **Node.js & Express**: RESTful API development.
- **MongoDB & Mongoose**: Database management.
- **JWT**: Authentication and authorization.

## Project Structure
### Frontend
- **components/**: Reusable UI components (MapComponent, ElevationChart, TrailList, TrailDetail).
- **views/**: Main application views (Dashboard, TrailCreation, SavedTrails).
- **store/**: State management.
- **services/**: API communication.

### Backend
- **routes/**: API endpoints.
- **models/**: Mongoose schemas.
- **controllers/**: Business logic.
- **services/**: Data processing and external connections.
