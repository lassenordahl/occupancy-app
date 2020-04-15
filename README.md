# TIPPERS Occupancy App

This is the repository for the TIPPERS Occupancy App, an application used for analyzing occupancies using the TIPPERS Api across UC Irvine's campus. This was developed by primarily by Lasse Nordahl with assistance from Tristan Jogminas for Authentication/Deployment improvements.

## Running

The TIPPERS Occupancy App is a create-react-app application and is run through the same steps.

### Step 1

Download the repository

### Step 2

Run `npm install` inside the repository

### Step 3

Configure the application to utilize the correct endpoints through:
1. Changing the `baseUrl` in api.js to point to your TIPPERS Api.
2. Changing the `app_config.id` in config.js to be the ID of the root entity for the occupancy app.

### Step 3 

Run the application using `npm start`

## Functionality 

The TIPPERS Occupancy App is built to utilize the TIPPERS Semiotic API for realtime and historical occupancy tracking of different IoT spaces. Look below to see different functionalities of the app.

### View heatmaps of various spaces
![Campus View](https://user-images.githubusercontent.com/13127625/79298585-6309c400-7e96-11ea-842f-762aceccac8d.png)

### Select different time intervals
![Time Interval](https://user-images.githubusercontent.com/13127625/79298720-cbf13c00-7e96-11ea-8ca6-fdb77023d00a.png)

### Observe nested spaces
![Donald Bren Hall View](https://user-images.githubusercontent.com/13127625/79298749-e2979300-7e96-11ea-935f-e1e5a2b11f2d.png)

### See floor-maps created by users
![Floor Maps](https://user-images.githubusercontent.com/13127625/79298797-08bd3300-7e97-11ea-9ef1-ea83892bad26.png)

### See advanced analytics for different spaces (Work in progress)
![Analytics](https://user-images.githubusercontent.com/13127625/79298766-efb48200-7e96-11ea-9f04-728fd097c5e8.png)

