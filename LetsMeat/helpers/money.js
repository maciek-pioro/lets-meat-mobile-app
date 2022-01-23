export const formatAmount = (amount) => (amount / 100).toFixed(2);

export const parseAmount = (amount) => Math.round(100 * parseFloat(amount.replace(',', '.')));

export const isAmountValid = (amount) => amount
  && (/^[0-9]+((,|\.)([0-9]{2}))?$/).test(amount)
  && parseAmount(amount) !== 0;
