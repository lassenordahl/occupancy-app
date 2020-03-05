import Rainbow from 'rainbowvis.js';

export default function getBlueRainbow(max) {
  let rainbow = new Rainbow();
  rainbow.setSpectrum('#ffbf40', '#fc572d');
  // Add one to max because max defaults to 0
  rainbow.setNumberRange(0, max + 1);
  return rainbow;
}