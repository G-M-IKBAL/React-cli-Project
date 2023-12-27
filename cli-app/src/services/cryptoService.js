export const fetchAveragePrice = async (pair) => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${pair}`);
      if (!response.ok) {
        throw new Error('Failed to fetch the average price.');
      }
      const data = await response.json();
      return `The current price of ${pair} is ${data.price}.`;
    } catch (error) {
      console.error(error);
      return `Error: Unable to retrieve the price for ${pair}.`;
    }
};
