/* eslint-disable no-continue */
// eslint-disable-next-line import/prefer-default-export
export const combineLocations = (results) => {
  const predictions = results.google_maps_locations_predictions;
  let predictionsIndex = 0;
  const gmaps = results.google_maps_locations;
  let gmapsIndex = 0;
  const custom = results.custom_locations;
  let customIndex = 0;
  const combinedResults = [];
  for (let i = 0; i < predictions.length + gmaps.length + custom.length; i += 1) {
    if (i % 3 === 0) {
      if (customIndex >= custom.length) continue;
      combinedResults.push({ ...custom[customIndex], kind: 'custom_locations' });
      customIndex += 1;
    } else if (i % 3 === 1) {
      if (gmapsIndex >= gmaps.length) continue;
      combinedResults.push({ ...gmaps[gmapsIndex], kind: 'google_maps_locations' });
      gmapsIndex += 1;
    } else if (i % 3 === 2) {
      if (predictionsIndex >= predictions.length) continue;
      combinedResults.push({ ...predictions[predictionsIndex], kind: 'google_maps_locations_predictions' });
      predictionsIndex += 1;
    }
  }
  return combinedResults;
};
