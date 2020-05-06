export function isValidUrl(route) {
  if (route.length === 1) {
    return route[0] !== "";
  }
  for (let i = 0; i < route.length; i++) {
    if (i % 2 === 0) {
      if (!Number.isInteger(parseInt(route[i]))) {
        return false;
      }
    }
  }
  return true;
}