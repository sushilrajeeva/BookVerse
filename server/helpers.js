//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
//Used professor's lecture code 5 and my lab6 helper functions i created previously for my reference

import { ObjectId } from "mongodb";
import { GraphQLError } from "graphql";
import { v4 as uuid } from "uuid"; //for generating _id's
import { validate } from "uuid";
import ISBN from "isbn3";

const exportedMethods = {
  description: "This is my helper function for lab-3",
  checkId(id) {
    if (!id) {
      throw "Error: You must provide an id to search for";
    }
    if (typeof id !== "string") {
      throw "Error: id must be a string";
    }
    id = id.trim();
    if (id.length === 0) {
      throw "Error: id cannot be an empty string or just spaces";
    }
    if (!ObjectId.isValid(id)) {
      throw "Error: invalid object ID";
    }
    return id;
  },
  isValidUUID(id) {
    if (!id) {
      throw "Error: You must provide an id to search for";
    }
    if (typeof id !== "string") {
      throw "Error: id must be a string";
    }
    id = id.trim();
    if (id.length === 0) {
      throw "Error: id cannot be an empty string or just spaces";
    }
    //Reference -> https://www.npmjs.com/package/uuid-validate
    if (!validate(id)) {
      throw new GraphQLError(`Invalid UUID - ${id}`, {
        extensions: { code: "Invalid_UUID" },
      });
    }
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) {
      throw new GraphQLError(`Error: You must supply a ${varName}!`, {
        extensions: { code: `Invalid_${varName}` },
      });
    }
    if (typeof strVal !== "string") {
      throw new GraphQLError(`Error: ${varName} must be a string!`, {
        extensions: { code: `Invalid_${varName}` },
      });
    }
    strVal = strVal.trim();
    if (strVal.length === 0) {
      throw new GraphQLError(
        `Error: ${varName} cannot be an empty string or string with just spaces`,
        {
          extensions: { code: `Invalid_${varName}` },
        }
      );
    }
    if (!isNaN(strVal)) {
      throw new GraphQLError(
        `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`,
        {
          extensions: { code: `Invalid_${varName}` },
        }
      );
    }

    return strVal;
  },

  isValidNumber(num) {
    // Checking if the input is a number (after removing whitespace)
    if (isNaN(Number(num.trim()))) {
      throw `The input must be a valid number.`;
    }
    if (Number(num.trim()) <= 0) {
      throw `Valid page number must be greater than 0.`;
    }
  },

  isValidMinMax(min, max) {
    // Validating the min and max values
    if (typeof min !== "number" || min < 0) {
      throw new GraphQLError(
        "Invalid min value. It should be a float or whole number >= 0",
        {
          extensions: { code: "Invalid_Value" },
        }
      );
    }

    if (typeof max !== "number" || max <= min) {
      throw new GraphQLError(
        "Invalid max value. It should be a float or whole number greater than the min value",
        {
          extensions: { code: "Invalid_Value" },
        }
      );
    }
  },

  isString(input) {
    if (typeof input === string) {
      return true;
    } else {
      return false;
    }
  },

  isValidFirstNameLastName(input, type) {
    const regex = /^[A-Za-z]+$/;
    if (!regex.test(input.trim())) {
      throw new GraphQLError(
        `Invalid ${type} - ${input}. ${type} should only contain letters A-Z (all cases) and no numbers`,
        {
          extensions: { code: `Invalid_${type}` },
        }
      );
    }
  },

  isValidDate(input) {
    //Took reference from -> https://www.freecodecamp.org/news/regex-for-date-formats-what-is-the-regular-expression-for-matching-dates/
    //My logic doesn't take consideration of edge cases like leap year
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!dateRegex.test(input.trim())) {
      throw new GraphQLError(
        `Invalid Date: ${input}. It should be of format M/D/YYYY or MM/DD/YYYY only.`,
        {
          extensions: { code: `Invalid_Date_Format` },
        }
      );
    }

    //Now adding more advancement to my method to handle valid days in a month , accounting for leap years too
    //I am extracting month, day and year from my input date
    const [month, day, year] = input.split("/").map((num) => parseInt(num, 10));

    //Reference to check leap year -> https://www.geeksforgeeks.org/javascript-program-to-check-if-a-given-year-is-leap-year/#
    const isLeapYear = (year) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    //I will now list out days in each month, also list out 28/29 if it is a leap year for february month
    let feb = isLeapYear(year) ? 29 : 28;
    const noDaysInMonth = [
      31, // January
      feb, // February
      31, // March
      30, // April
      31, // May
      30, // June
      31, // July
      31, // August
      30, // September
      31, // October
      30, // November
      31, // December
    ];

    //now checking if day is greater or not than it should be from my noDaysInMonth list
    if (day > noDaysInMonth[month - 1]) {
      throw new GraphQLError(
        `Invalid Day: ${day} for month ${month} in year ${year}.`,
        {
          extensions: { code: `Invalid_Date_Format` },
        }
      );
    }
  },

  isValidUSstate(state) {
    //Got this from -> https://gist.github.com/mshafrir/2646763
    let validStates = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];

    if (state.length !== 2) {
      throw new GraphQLError(
        `Invalid State abbreviation - ${state}, it should be only 2 letters and a valid US State abbreviation`,
        {
          extensions: { code: `Invalid_State_abbreviation_Length` },
        }
      );
    }

    if (!validStates.includes(state)) {
      throw new GraphQLError(
        `Invalid State abbreviation - ${state}, it is not a valid US State abbreviation`,
        {
          extensions: { code: `Invalid_State_abbreviation` },
        }
      );
    }
  },

  isValidArrayElements(arrays) {
    for (const [key, arr] of Object.entries(arrays)) {
      for (const elem of arr) {
        if (typeof elem !== "string") {
          throw new GraphQLError(
            `Element ${elem} in ${key} should be a string.`
          );
        }
        if (!elem.trim()) {
          throw new GraphQLError(
            `Element in ${key} should not be empty or just spaces.`
          );
        }
      }
    }
  },

  isValidISBN(isbn) {
    //reference -> https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch04s13.html
    //reference -> https://stackoverflow.com/questions/22672350/regular-expression-for-10-or-13-digits
    // var regex = /^(?:[0-9]{9}[0-9X]|[0-9]{13})$/;
    // if (!regex.test(isbn)) {
    //   throw new GraphQLError(
    //     "The provided ISBN is not in a valid ISBN-10 or ISBN-13 format"
    //   );
    // }
    const isbnValidate = ISBN.parse(isbn);
    if (isbnValidate === null) {
      throw new GraphQLError("Invalid ISBN");
    }
  },

  isValidPageCount(pageCount) {
    // Checking if pageCount is a number and is greater than 0
    if (
      typeof pageCount !== "number" ||
      pageCount <= 0 ||
      !Number.isInteger(pageCount)
    ) {
      throw new GraphQLError(
        "Page count must be a positive whole number greater than 0"
      );
    }
  },

  isValidPrice(price) {
    // Checking if price is a number (integer or float) and if it is greater than 0
    if (typeof price !== "number" || price <= 0) {
      throw new GraphQLError(
        "Price must be a positive number (whole number or float) greater than 0"
      );
    }
  },
};

export default exportedMethods;
