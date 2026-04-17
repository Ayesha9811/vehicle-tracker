export const STATUS_COLORS = {
  Moving: 'bg-green-100 text-green-800',
  Idle: 'bg-yellow-100 text-yellow-800',
  Offline: 'bg-red-100 text-red-800',
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const formatSpeed = (speed) => {
  return `${speed} km/h`;
};