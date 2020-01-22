export function capitalizeWords(word) {
  if (word === undefined) {
    return '';
  }
  
  return word.split(' ').map(function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }).join(' ');
}