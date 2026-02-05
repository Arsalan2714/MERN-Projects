const formatDate = (date) => {
  const d = new Date(date);
  // Format: MM/DD/YYYY, HH:MM AM/PM
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default formatDate;