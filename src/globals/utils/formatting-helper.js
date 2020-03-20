import { DateTimePicker } from "react-rainbow-components";

export function capitalizeWords(word) {
  if (word === undefined) {
    return '';
  }
  
  return word.split(' ').map(function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }).join(' ');
}

export function serializeLocation(useLocationObject) {
  let location = useLocationObject.pathname.split('/')
  location.shift(); // Remove the first empty string from the first slash
  return location;
}

export function serializeLocationString(locationString) {
  let location = locationString.split('/')
  location.shift(); // Remove the first empty string from the first slash
  return location;
}

export function getMostRecentOccupancyTimestamp(occupancies) {
  if (occupancies === null || occupancies === undefined || occupancies.length < 1) {
    return new Date();
  }
  // Epoch time
  let mostRecentDate = occupancies[0].timestamp;
 
  for (let i = 0; i < occupancies; i++) {
    if (occupancies[i].timestamp > mostRecentDate) {
      mostRecentDate = occupancies[i].timestamp;
    }
  }
  return Date(mostRecentDate);
}