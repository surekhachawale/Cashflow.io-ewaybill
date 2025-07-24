/**
 * @class jsUtilities - A javascript utility class that provides frequently used functions
 */
class jsUtilities{
/**
* @method numberFormat - To format a given number according to given style of thousands separators. US style formatting has a comma (“,”) after every 3 digits 
* while Indian style uses a comma before only last 3 digits and rest of the number has comma after every 2 digits. 
* @memberof jsUtilities 
* @author Sudhir Joshi
*
* @param {string} numberToFormat - the number to be formatted. Default value is 0
* @param {int} decimals - number of decimal places to be used. Default value is 0		
* @param {string} style - tells whether Indian style or US style. Default value is Indian. Can take "Indian" or "IN" for Indian style, "European" or "EU" for European style. Any other value would force US style
* @returns Formatted number string
*
* @example 
* call the function as numberFormat(12345678.378,2)
* Number is     - 1234567890.378
* Indian Style  – 1,23,45,67,890.39
* US Style      – 1,234,567,890.39
* European Style- 1.234.567.890,39  (Note here that EU style has swapped "," and ".")
*/
numberFormat(numberToFormat = 0, decimals = 0, style = "Indian") {
    numberToFormat = numberToFormat.toFixed(decimals);
    style = style.toLowerCase();
    var x = numberToFormat.toString();
    var decimalPosition = x.indexOf(".");
    var thousandSeparatorDigits = (style === "indian" || style === "in" ? 2 : 3);
    if (decimalPosition <= 0) { decimalPosition = x.length }
    var lastThree = x.substring(decimalPosition - 3);
    var otherNumbers = x.substring(0, decimalPosition - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var myregex = new RegExp(`\\B(?=(\\d{${thousandSeparatorDigits}})+(?!\\d))`, 'g');
    var res = otherNumbers.replace(myregex, ",") + lastThree;
    if (style === "european" || style === "eu") {
        res = res.split(",").map(s => s.split(".").join(",")).join(".")
    }
    return res;
}

/**
* @method dateFormat - To format a given date string and format it to required pattern 
* @author Sudhir Joshi
* 
* @param {string} dateString - the date string to be formatted. Required parameter.
* @param {string} requiredFormat - format string such as "yyyy-mm-dd". Default is "dd-MMM-yyyy"
* @returns Formatted date string
*
* @example 
* call the function as dateFormat(new Date("25 May 2000"),"dd-MM-yyyy")
* return string = "25-05-2000"
*/
dateFormat(dateString = "", requiredFormat = "dd-MMM-yyyy") {
    if (dateString === "") {
        return "dateString is required";
    }
    var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({ pattern: requiredFormat });
    return formattedDate.format(new Date(dateString));
}

/**
* @method dateDiff - To calculate difference between two dates
* @author Stack Overflow @see {@link https://stackoverflow.com/questions/17732897/difference-between-two-dates-in-years-months-days-in-javascript}
* 
* @param {string} startingDate - String for starting date
* @param {string} endingDate - String for ending date
* @returns {json} difference between dates
*
* @example 
* call the function as dateDiff("15 dec 2024","15 April 2024"). This method calculates the difference by detecting the bigger date value
* return JSON = {"Years":0,"Months":7,"Days":29}
*/
dateDiff(startingDate, endingDate) {
    let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    if (!endingDate) {
      endingDate = new Date().toISOString().substr(0, 10); 
    }
    let endDate = new Date(endingDate);
    if (startDate > endDate) {
      const swap = startDate;
      startDate = endDate;
      endDate = swap;
    }
    const startYear = startDate.getFullYear();
    const february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    let yearDiff = endDate.getFullYear() - startYear;
    let monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    let dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[startDate.getMonth()];
    }
    return '{"Years":'+yearDiff+',"Months":'+monthDiff+',"Days":'+dayDiff+'}';
    //yearDiff + 'Y ' + monthDiff + 'M ' + dayDiff + 'D';
  }

	/**
	* @method amount_in_words - To convert given value to words, in Indian style 
	* @author Sapana Chorghe
	* 
	* @param {string} value - value to spell out, with optional currency. If currency is not given, default is INR
	*
	* @returns String spelling out the value
	*
	* @example Call the function to put value string on console as console.log(amount_in_words(9999999999));
	*			Prints  Nine Hundred and Ninety Nine Crore Ninety Nine Lakh Ninety Nine Thousand Nine Hundred and Ninety Nine Only
	* 
	*/ 
	amount_in_words(value) { 
	value = value.toString().replace(/,/g, "");
    // Define currency symbols and their corresponding currency codes
    const currencySymbols = { 
        "$": "USD", "€": "EUR", "₹": "INR","INR": "INR", "£": "GBP", "¥": "JPY", 
        "A$": "AUD", "C$": "CAD", "د.إ": "AED", "AED":"AED"
    };

    // Define currency names, subunits, and number system used (Indian or International)
    const currencyNames = {
        USD: { main: "Dollars", sub: "Cents", system: "international" },
        EUR: { main: "Euros", sub: "Cents", system: "international" },
        INR: { main: "Rupees", sub: "Paise", system: "indian" },
        GBP: { main: "Pounds", sub: "Pence", system: "international" },
        JPY: { main: "Yen", sub: "Sen", system: "international" },
        AUD: { main: "Australian Dollars", sub: "Cents", system: "international" },
        CAD: { main: "Canadian Dollars", sub: "Cents", system: "international" },
        AED: { main: "Dirhams", sub: "Fils", system: "international" }
    };

    // Default currency is INR (Indian Rupees)
    let currency = "INR"; 
    value = value.toString().trim(); // Convert input to string and remove leading/trailing spaces

    // Check if the value starts with a currency symbol and extract currency
    for (let symbol in currencySymbols) {
        if (value.startsWith(symbol)) {
            currency = currencySymbols[symbol]; // Assign the detected currency
            value = value.substring(symbol.length).trim(); // Remove symbol from the value
            break; // Stop checking once the symbol is found
        }
    }

    // Check if currency code is provided at the end (e.g., "100 USD")
    let parts = value.split(" ");
    if (parts.length === 2) {
        value = parseFloat(parts[0]); // Extract numerical value
        currency = parts[1].toUpperCase(); // Convert currency code to uppercase
    } else {
        value = parseFloat(value); // Convert string to a number
    }
 
    // If the conversion results in NaN, return an error message
    if (isNaN(value)) {
        return "Invalid input format";
    }

    // Separate whole and decimal parts of the value
    let wholePart = Math.floor(value); // Extract integer part
    let decimalPart = Math.round((value - wholePart) * 100); // Extract decimal part and round to 2 digits

    // Retrieve currency name and subunit from the currencyNames object
    let currencyMain = currencyNames[currency]?.main || "Currency"; // Default to "Currency" if not found
    let currencySub = currencyNames[currency]?.sub || "Subunit"; // Default to "Subunit" if not found
    let numberSystem = currencyNames[currency]?.system || "international"; // Default to international system

    // Function to convert numbers to words
    function valueToWords(num, system = "international") {
        if (num === 0) return "Zero"; // Handle zero case separately

        // Define number words for ones, teens, and tens places
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        // Define number scales for Indian and International numbering systems
        const indianScales = ["", "Thousand", "Lakh", "Crore", "Arab", "Kharab"];
        const internationalScales = ["", "Thousand", "Million", "Billion", "Trillion"];

        // Choose the appropriate numbering system
        let scales = system === "indian" ? indianScales : internationalScales;
        let divisor = system === "indian" ? [1000, 100, 100] : [1000, 1000, 1000]; // Grouping rules for INR vs International

        // Function to convert numbers less than 1000 to words
        function convertLessThanThousand(n) {
            let str = "";
            if (n >= 100) {
                str += ones[Math.floor(n / 100)] + " Hundred "; // Convert hundreds place
                n %= 100; // Get remainder
            }
            if (n >= 10 && n <= 19) {
                str += teens[n - 10] + " "; // Convert teen numbers (10-19)
            } else {
                str += tens[Math.floor(n / 10)] + " "; // Convert tens place
                str += ones[n % 10] + " "; // Convert ones place
            }
            return str.trim(); // Remove extra spaces and return result
        }

        let word = "", i = 0;
        
        // Convert number into words using scales
        while (num > 0) {
            let chunk = num % divisor[i % divisor.length]; // Get the last chunk based on grouping
            if (chunk !== 0) {
                word = convertLessThanThousand(chunk) + " " + scales[i] + " " + word; // Append scale name
            }
            num = Math.floor(num / divisor[i % divisor.length]); // Remove the last chunk
            i++; // Move to next scale
        }

        return word.trim(); // Remove extra spaces and return the final word representation
    }

    // Convert whole part of value into words
    let words = valueToWords(wholePart, numberSystem) + " " + currencyMain;

    // Convert decimal part if it exists and add to words
    let fractionWords = decimalPart > 0 ? " and " + valueToWords(decimalPart, "international") + " " + currencySub : "";

    // Return the full value in words with "Only" at the end
    return words + fractionWords + " Only";
}
}