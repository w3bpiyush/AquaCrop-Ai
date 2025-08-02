const addTimeToStartTime = (hoursToAdd) => {
    const startTimeMinutes = 22 * 60; // 22:00 → 1320 minutes
    const addedMinutes = Math.round(hoursToAdd * 60);
    const totalMinutes = (startTimeMinutes + addedMinutes) % (24 * 60); // wrap around 24h

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const roundToNearestQuarter = (hours) => {
  return Math.round(hours * 4) / 4;
};

module.exports = {
  addTimeToStartTime,
  roundToNearestQuarter
};