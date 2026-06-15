const { getSettings } = require('./settings');

const calculatePrice = (pageCount, printType, paperSize, copies) => {
  const settings = getSettings();
  
  const basePrice = settings.paper[paperSize]?.basePrice || 500;
  const multiplier = settings.color[printType]?.multiplier || 1;
  
  const pricePerPage = basePrice * multiplier;

  return pageCount * pricePerPage * copies;
};

module.exports = { calculatePrice };
