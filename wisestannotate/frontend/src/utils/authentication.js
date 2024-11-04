export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authTokenWisest');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
};


export const isUserAuthenticated = async () => {
  try {
    const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/authenticate-user`);
    const data = await response.json();

    return data.authenticated === true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const hasCommonNumberInTwoArrays = (arrayA, arrayB) => {
  // Flatten arrays for easier comparison
  const flattenedA = arrayA.flat();
  const flattenedB = arrayB.flat();

  // Check if any number in arrayB appears in arrayA
  return flattenedB.some(numB => flattenedA.includes(numB));
}

export const addMissingNumbersInArray = (start, end, array) => {
  // Flatten the array if it contains nested arrays
  const flatArray = array.flat();
  
  // Create an empty array to hold the missing numbers
  const missingNumbers = [];
  
  // Iterate from start to end and check if each number exists in the flat array
  for (let i = start; i <= end; i++) {
      if (!flatArray.includes(i)) {
          // If the number is missing, add it as an array to the missingNumbers array
          missingNumbers.push([i]);
      }
  }
  
  // Append the missing numbers arrays to the original array
  array.push(...missingNumbers);
  
  return array;
}
