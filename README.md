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
1. Changing the `REACT_APP_BASE_URL` in .react to point to your TIPPERS Api.
2. Changing the `REACT_APP_OBSERVATION_ID` in .react to be the observation type for `occupancy` values on the TIPPERS Api.
3. Changing the `REACT_APP_BASE_ENTITY` in .react to be the id of the entity that will serve as the root of your application.

### Step 4

Run the application using `./react start [configuration case (dev, uci, etc)]`

### Step 5 (Deployment)

Build the application using `./react build [configuration case (dev, uci, etc)]`

## Functionality 

The TIPPERS Occupancy App is built to utilize the TIPPERS Semiotic API for realtime and historical occupancy tracking of different IoT spaces. Data for different entities can be exported using the data analytics panel to a CSV. Take a look below to see different functionalities of the app.

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

