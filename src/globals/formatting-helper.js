export function capitalizeWords(word) {
  return word.split(' ').map(function(str) {
    return str.charAt(0).toUpperCase + str.slice(1);
  });
}