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
