export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const groupNumberWithSeparator = (number, separator) => {
  // Convert the number to a string
  let numberString = number.toString();

  // Split the string into groups of three from the right
  let groups = [];
  while (numberString.length > 3) {
    groups.unshift(numberString.slice(-3));
    numberString = numberString.slice(0, -3);
  }
  groups.unshift(numberString); // Add the remaining part

  // Join the groups with the separator
  return groups.join(separator);
};
