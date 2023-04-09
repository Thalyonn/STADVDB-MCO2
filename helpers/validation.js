function isValidRating(rating) {
  if (rating >= 0 || rating <= 10) {
    return true;
  }
  return false;
}

module.exports = {
  isValidRating
}