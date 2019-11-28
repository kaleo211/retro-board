const isBlank = (obj) => {
  return obj === '' || obj == null || obj === undefined || (Array.isArray(obj) && obj.length === 0);
};

module.exports = {
  isBlank,
};
