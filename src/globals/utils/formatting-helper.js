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