import { fetchAveragePrice } from './cryptoService';


export const processCommand = async (command) => {
    const [cmd, ...args] = command.trim().split(/\s+/);

    switch (cmd) {
        case 'help':
        return [
          'Available commands:',
          '_________________________________________________________________________________________________________________________________________',
          '- help: Show available commands',
          '- about: Display information about this CLI',
          '- fetch-price [coin]: Fetch the current price of a specified cryptocurrency e.g fetch-price btcusdt',
          '- upload: Opens the file explorer to allow uploading csv files only.',
          '- draw [file] [columns]: Draws the chart of the specified columns of the file in the draw-chart directory. e.g draw Data.csv Price,Low',
          '- delete [file]: Deletes a specified file from the draw-chart directory.',
          '_________________________________________________________________________________________________________________________________________',


        ];

        case 'about':
        return [


           '_________________________________________________________________________________________________________________________________________',

            'CLI Version 1.0',
            'This is a front-end CLI created as a part of the Full Stack Hiring test. It simulates various command-line functionalities.',

            '_________________________________________________________________________________________________________________________________________',

          ];
        case 'fetch-price':
            if (args.length === 1) {
            const pair = args[0].toUpperCase();
            const priceMessage = await fetchAveragePrice(pair);
            return [priceMessage];
            } 
        else {
        return ['Error: You must specify a Valid cryptocurrency pair. \n\nPlease Visit (https://coinranking.com/exchange/-zdvbieRdZ+binance/markets)'];
        }

        case 'upload':
          return ['Processing...'];

        case 'draw':
            
          
            return ['Drawing Chart Base on [file]...']

            case 'delete':
          return ['Processing...'];


         



  // try {
  //   const response = await fetch('http://localhost:3000/draw-chart', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ fileName: filename, columns: columns }),
  //   });
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   const data = await response.json();
    
    

  //   return ['Chart drawn successfully.'];
  // } 
  
  // catch (error) {
  //   console.error('Error:', error);
  //   return ['Error drawing chart.'];
  // }



      default:
        return [`Command not recognized: ${command}`];
    }



    

};



