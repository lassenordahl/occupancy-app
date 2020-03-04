import Rainbow from 'rainbowvis.js';

export default function getBlueRainbow(max) {
  let rainbow = new Rainbow();
  rainbow.setSpectrum('#64b1e8', '#3e2ed1');
  // Add one to max because max defaults to 0
  rainbow.setNumberRange(0, max + 1);
  return rainbow;
}