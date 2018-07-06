(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    // CommonJS
    mod(require("../../../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    // AMD
    define(["../../../../lib/codemirror"], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function highlightFnParamTooltop(editor, keywords, item) {
    var pos = editor.getCursor();
    var charPos = pos.ch;
    var line = editor.getLine(pos.line);
    line = line.substring(0, charPos);
    var delay = item.delay || 0
    var splitByOpenBracket = line.split("(");
    if (splitByOpenBracket.length > 1) {
      var insideBracket = splitByOpenBracket.pop();
      var fnIndex = splitByOpenBracket.join("(").length - 1;
      var word = editor.intellisense.getWordAtPosition({
        line: pos.line,
        ch: fnIndex
      });
      if (word) {
        var defn = keywords.find(function(k) {
          return k.name.toLowerCase() == word.toLowerCase();
        });
        if (defn) {
          var commas = insideBracket.split(",").length - 1;
          var tooltip = editor.intellisense.formatItemTooltip(defn, {
            highlight: commas
          });
          setTimeout(function () {
            editor.intellisense.showHoverTooltip(tooltip);
          }, delay)
          
        }
      }
    }
  }
  /**
   * returns a set of triggers and keywords
   * Triggers require a keyCode and a trigger which is either declaration or method
   * a declaration trigger can have the key next so that it triggers on the NEXT character inserted
   * a method trigger can have a close parameter to indicate whether the overlays should be closed
   */
  CodeMirror.defineIntellisense("spreadsheet", function() {
    return {
      triggers: [
        { keyCode: 187, trigger: "declaration" }, //=
        { keyCode: 32, ctrlKey: true, trigger: "declaration" }, //ctrl+space
        { keyCode: 48, shiftKey: true, close: true, trigger: "method" }, //)
        { keyCode: 57, shiftKey: true, next: true, trigger: "declaration" }, // (
        { keyCode: 57,  trigger: "method", shiftKey:true, function: highlightFnParamTooltop, delay: 200 }, // ,
        { keyCode: 8, function(editor) {
          var pos = editor.getCursor()
          var intellisenseStart = editor.intellisense.getDecls().initialFilterPosition
          if (intellisenseStart && pos.ch < intellisenseStart.ch && editor.intellisense.getDecls().isVisible()) {
            editor.intellisense.getDecls().setVisible(false)
          }
          
        },trigger: "method" }, // bkspace
        { keyCode: 188,  trigger: "method", function: highlightFnParamTooltop } // ,
      ],
      keywords: {
        ABS: {
          description:
            "This function calculates the absolute value of the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ACCRINT: {
          description:
            "This function calculates the accrued interest for a security that pays periodic interest.",
          parameters: [
            {
              name: "issue"
            },
            {
              name: "first"
            },
            {
              name: "settle"
            },
            {
              name: "rate"
            },
            {
              name: "par"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        ACCRINTM: {
          description:
            "This function calculates the accrued interest at maturity for a security that pays periodic interest.",
          parameters: [
            {
              name: "issue"
            },
            {
              name: "maturity"
            },
            {
              name: "rate"
            },
            {
              name: "par"
            },
            {
              name: "basis"
            }
          ]
        },
        ACOS: {
          description:
            "This function calculates the arccosine, that is, the angle whose cosine is the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ACOSH: {
          description:
            "This function calculates the inverse hyperbolic cosine of the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ADDRESS: {
          description:
            "This function uses the row and column numbers to create a cell address in text.",
          parameters: [
            {
              name: "row"
            },
            {
              name: "column"
            },
            {
              name: "absnum"
            },
            {
              name: "a1style"
            },
            {
              name: "sheettext"
            }
          ]
        },
        AMORDEGRC: {
          description:
            "This function returns the depreciation for an accounting period, taking into consideration prorated depreciation, and applies a depreciation coefficient in the calculation based on the life of the assets.",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "datepurchased"
            },
            {
              name: "firstperiod"
            },
            {
              name: "salvage"
            },
            {
              name: "period"
            },
            {
              name: "drate"
            },
            {
              name: "basis"
            }
          ]
        },
        AMORLINC: {
          description:
            "This function calculates the depreciation for an accounting period, taking into account prorated depreciation.",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "datepurchased"
            },
            {
              name: "firstperiod"
            },
            {
              name: "salvage"
            },
            {
              name: "period"
            },
            {
              name: "drate"
            },
            {
              name: "basis"
            }
          ]
        },
        AND: {
          description:
            "Check whether all arguments are True, and returns True if all arguments are True.",
          parameters: [
            {
              name: "logical1"
            },
            {
              name: "logical2"
            }
          ]
        },
        ASIN: {
          description:
            "This function calculates the arcsine, that is, the angle whose sine is the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ASINH: {
          description:
            "This function calculates the inverse hyperbolic sine of a number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ATAN: {
          description:
            "This function calculates the arctangent, that is, the angle whose tangent is the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ATAN2: {
          description:
            "This function calculates the arctangent of the specified x- and y-coordinates.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "y"
            }
          ]
        },
        ATANH: {
          description:
            "This function calculates the inverse hyperbolic tangent of a number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        AVEDEV: {
          description:
            "This function calculates the average of the absolute deviations of the specified values from their mean.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        AVERAGE: {
          description:
            "This function calculates the average of the specified numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        AVERAGEA: {
          description:
            "This function calculates the average of the specified values, including text or logical values as well as numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        AVERAGEIF: {
          description:
            "This function calculates the average of the specified numeric values provided that they meet the specified criteria.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            },
            {
              name: "condition"
            }
          ]
        },
        AVERAGEIFS: {
          description:
            "This function calculates the average of all cells that meet multiple specified criteria.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "condition1"
            },
            {
              name: "value2",
              repeatable: true
            },
            {
              name: "condition2..."
            }
          ]
        },
        BESSELI: {
          description:
            "This function calculates the modified Bessel function of the first kind evaluated for purely imaginary arguments.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "order"
            }
          ]
        },
        BESSELJ: {
          description:
            "This function calculates the Bessel function of the first kind.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "order"
            }
          ]
        },
        BESSELK: {
          description:
            "This function calculates the modified Bessel function of the second kind evaluated for purely imaginary arguments.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "order"
            }
          ]
        },
        BESSELY: {
          description:
            "This function calculates the Bessel function of the second kind.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "order"
            }
          ]
        },
        BETADIST: {
          description:
            "This function calculates the cumulative beta distribution function.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "lower"
            },
            {
              name: "upper"
            }
          ]
        },
        BETAINV: {
          description:
            "This function calculates the inverse of the cumulative beta distribution function.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "lower"
            },
            {
              name: "upper"
            }
          ]
        },
        BIN2DEC: {
          description:
            "This function converts a binary number to a decimal number",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        BIN2HEX: {
          description:
            "This function converts a binary number to a hexadecimal number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        BIN2OCT: {
          description:
            "This function converts a binary number to an octal number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        BINOMDIST: {
          description:
            "This function calculates the individual term binomial distribution probability.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "n"
            },
            {
              name: "p"
            },
            {
              name: "cumulative"
            }
          ]
        },
        CEILING: {
          description:
            "This function rounds a number up to the nearest multiple of a specified value.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "signif"
            }
          ]
        },
        CHAR: {
          description:
            "This function returns the character specified by a number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        CHIDIST: {
          description:
            "This function calculates the one-tailed probability of the chi-squared distribution.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "deg"
            }
          ]
        },
        CHIINV: {
          description:
            "This function calculates the inverse of the one-tailed probability of the chi-squared distribution",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "deg"
            }
          ]
        },
        CHITEST: {
          description:
            "This function calculates the test for independence from the chi-squared distribution.",
          parameters: [
            {
              name: "obs_array"
            },
            {
              name: "exp_array"
            }
          ]
        },
        CHOOSE: {
          description: "This function returns a value from a list of values.",
          parameters: [
            {
              name: "index"
            },
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        CLEAN: {
          description:
            "This function removes all non-printable characters from text.",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        CODE: {
          description:
            "This function returns a numeric code to represent the first character in a text string. The returned code corresponds to the Windows character set (ANSI).",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        COLUMN: {
          description:
            "This function returns the column number of a reference.",
          parameters: [
            {
              name: "reference"
            }
          ]
        },
        COLUMNS: {
          description:
            "This function returns the number of columns in an array.",
          parameters: [
            {
              name: "array"
            }
          ]
        },
        COMBIN: {
          description:
            "This function calculates the number of possible combinations for a specified number of items.",
          parameters: [
            {
              name: "k"
            },
            {
              name: "n"
            }
          ]
        },
        COMPLEX: {
          description:
            "This function converts real and imaginary coefficients into a complex number.",
          parameters: [
            {
              name: "realcoeff"
            },
            {
              name: "imagcoeff"
            },
            {
              name: "suffix"
            }
          ]
        },
        CONCATENATE: {
          description:
            "This function combines multiple text strings or numbers into one text string.",
          parameters: [
            {
              name: "text1"
            },
            {
              name: "text2"
            },
            {
              name: "...."
            }
          ]
        },
        CONFIDENCE: {
          description:
            "This function returns confidence interval for a population mean.",
          parameters: [
            {
              name: "alpha"
            },
            {
              name: "stdev"
            },
            {
              name: "size"
            }
          ]
        },
        CONVERT: {
          description:
            "This function converts a number from one measurement system to its equivalent in another measurement system.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "from-unit"
            },
            {
              name: "to-unit"
            }
          ]
        },
        CORREL: {
          description:
            "This function returns the correlation coefficient of the two sets of data.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        COS: {
          description:
            "This function returns the cosine of the specified angle.",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        COSH: {
          description:
            "This function returns the hyperbolic cosine of the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        COUNT: {
          description:
            "This function returns the number of cells that contain numbers.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        COUNTA: {
          description:
            "This function returns the number of number of cells that contain numbers, text, or logical values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        COUNTBLANK: {
          description:
            "This function returns the number of empty (or blank) cells in a range of cells on a sheet.",
          parameters: [
            {
              name: "cellrange"
            }
          ]
        },
        COUNTIF: {
          description:
            "This function returns the number of cells that meet a certain condition",
          parameters: [
            {
              name: "cellrange"
            },
            {
              name: "condition"
            }
          ]
        },
        COUNTIFS: {
          description:
            "This function returns the number of cells that meet multiple conditions.",
          parameters: [
            {
              name: "cellrange"
            },
            {
              name: "condition"
            }
          ]
        },
        COUPDAYBS: {
          description:
            "This function calculates the number of days from the beginning of the coupon period to the settlement date.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        COUPDAYS: {
          description:
            "This function returns the number of days in the coupon period that contains the settlement date.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        COUPDAYSNC: {
          description:
            "This function calculates the number of days from the settlement date to the next coupon date.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        COUPNCD: {
          description:
            "This function returns a date number of the next coupon date after the settlement date.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "frequency"
            },
            {
              name: "basi"
            }
          ]
        },
        COUPNUM: {
          description:
            "This function returns the number of coupons due between the settlement date and maturity date.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        COUPPCD: {
          description:
            "This function returns a date number of the previous coupon date before the settlement date.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        COVAR: {
          description:
            "This function returns the covariance, which is the average of the products of deviations for each data point pair in two sets of numbers.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        CRITBINOM: {
          description:
            "This function returns the criterion binomial, the smallest value for which the cumulative binomial distribution is greater than or equal to a criterion value.",
          parameters: [
            {
              name: "n"
            },
            {
              name: "p"
            },
            {
              name: "alpha"
            }
          ]
        },
        CUMIPMT: {
          description:
            "This function returns the cumulative interest paid on a loan between the starting and ending periods.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "nper"
            },
            {
              name: "pval"
            },
            {
              name: "startperiod"
            },
            {
              name: "endperiod"
            },
            {
              name: "paytype"
            }
          ]
        },
        CUMPRINC: {
          description:
            "This function returns the cumulative principal paid on a loan between the start and end periods.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "nper"
            },
            {
              name: "pval"
            },
            {
              name: "startperiod"
            },
            {
              name: "endperiod"
            },
            {
              name: "paytype"
            }
          ]
        },
        DATE: {
          description:
            "This function returns the DateTime object for a particular date, specified by the year, month, and day.",
          parameters: [
            {
              name: "year"
            },
            {
              name: "month"
            },
            {
              name: "day"
            }
          ]
        },
        DATEDIF: {
          description:
            "This function returns the number of days, months, or years between two dates.",
          parameters: [
            {
              name: "date1"
            },
            {
              name: "date2"
            },
            {
              name: "outputcode"
            }
          ]
        },
        DATEVALUE: {
          description:
            "This function returns a DateTime object of the specified date.",
          parameters: [
            {
              name: "date_string"
            }
          ]
        },
        DAVERAGE: {
          description:
            "This function calculates the average of values in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DAY: {
          description:
            "This function returns the day number of the month (integer 1 to 31) that corresponds to the specified date.",
          parameters: [
            {
              name: "date"
            }
          ]
        },
        DAYS360: {
          description:
            "This function returns the number of days between two dates based on a 360-day year.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "enddate"
            },
            {
              name: "method"
            }
          ]
        },
        DB: {
          description:
            "This function calculates the depreciation of an asset for a specified period using the fixed‑declining balance method",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "salvage"
            },
            {
              name: "life"
            },
            {
              name: "period"
            },
            {
              name: "month"
            }
          ]
        },
        DCOUNT: {
          description:
            "This function counts the cells that contain numbers in a column of a list or database that match the specified conditions",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DCOUNTA: {
          description:
            "This function counts the non-blank cells in a column of a list or database that match the specified conditions",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DDB: {
          description:
            "This function calculates the depreciation of an asset for a specified period using the double-declining balance method or another method you specify.",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "salvage"
            },
            {
              name: "life"
            },
            {
              name: "period"
            },
            {
              name: "factor"
            }
          ]
        },
        DEC2BIN: {
          description:
            "This function converts a decimal number to a binary number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        DEC2HEX: {
          description:
            "This function converts a decimal number to a hexadecimal number",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        DEC2OCT: {
          description:
            "This function converts a decimal number to an octal number",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        DEGREES: {
          description:
            "This function converts the specified value from radians to degrees",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        DELTA: {
          description:
            "This function identifies whether two values are equal. Returns 1 if they are equal; returns 0 otherwise.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2"
            }
          ]
        },
        DEVSQ: {
          description:
            "This function calculates the sum of the squares of deviations of data points (or of an array of data points) from their sample mean.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        DGET: {
          description:
            "This function extracts a single value from a column of a list or database that matches the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DISC: {
          description:
            "This function calculates the discount rate for a security.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "pricep"
            },
            {
              name: "redeem"
            },
            {
              name: "basis"
            }
          ]
        },
        DMAX: {
          description:
            "This function returns the largest number in a column of a list or database that matches the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DMIN: {
          description:
            "This function returns the smallest number in a column of a list or database that matches the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DOLLAR: {
          description:
            "This function converts a number to text using currency format, with the decimals rounded to the specified place.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "digits"
            }
          ]
        },
        DOLLARDE: {
          description:
            "This function converts a fraction dollar price to a decimal dollar price.",
          parameters: [
            {
              name: "fractionaldollar"
            },
            {
              name: "fraction"
            }
          ]
        },
        DOLLARFR: {
          description:
            "This function converts a decimal number dollar price to a fraction dollar price.",
          parameters: [
            {
              name: "decimaldollar"
            },
            {
              name: "fraction"
            }
          ]
        },
        DPRODUCT: {
          description:
            "This function multiplies the values in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DSTDEV: {
          description:
            "This function estimates the standard deviation of a population based on a sample by using the numbers in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DSTDEVP: {
          description:
            "This function calculates the standard deviation of a population based on the entire population using the numbers in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DSUM: {
          description:
            "This function adds the numbers in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DURATION: {
          description:
            "This function returns the Macaulay duration for an assumed par value of $100.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "coupon"
            },
            {
              name: "yield"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        DVAR: {
          description:
            "This function estimates the variance of a population based on a sample by using the numbers in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        DVARP: {
          description:
            "This function calculates the variance of a population based on the entire population by using the numbers in a column of a list or database that match the specified conditions.",
          parameters: [
            {
              name: "database"
            },
            {
              name: " field"
            },
            {
              name: " criteria"
            }
          ]
        },
        EDATE: {
          description:
            "This function calculates the date that is the indicated number of months before or after a specified date.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "months"
            }
          ]
        },
        EFFECT: {
          description:
            "This function calculates the effective annual interest rate for a given nominal annual interest rate and the number of compounding periods per year.",
          parameters: [
            {
              name: "nomrate"
            },
            {
              name: "comper"
            }
          ]
        },
        EOMONTH: {
          description:
            "This function calculates the date for the last day of the month (end of month) that is the indicated number of months before or after the starting date.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "months"
            }
          ]
        },
        ERF: {
          description:
            "This function calculates the error function integrated between a lower and an upper limit.",
          parameters: [
            {
              name: "limit"
            },
            {
              name: "upperlimit"
            }
          ]
        },
        ERFC: {
          description:
            "This function calculates the complementary error function integrated between a lower limit and infinity.",
          parameters: [
            {
              name: "lowerlimit"
            }
          ]
        },
        "ERROR.TYPE": {
          description:
            "This function returns a number corresponding to one of the error values.",
          parameters: [
            {
              name: "errorvalue"
            }
          ]
        },
        EURO: {
          description:
            "This function returns the equivalent of one Euro based on the ISO currency code.",
          parameters: [
            {
              name: "code"
            }
          ]
        },
        EUROCONVERT: {
          description:
            "This function converts currency from a Euro member currency (including Euros) to another Euro member currency (including Euros).",
          parameters: [
            {
              name: "currency"
            },
            {
              name: "source"
            },
            {
              name: "target"
            },
            {
              name: "fullprecision"
            },
            {
              name: "triangulation"
            }
          ]
        },
        EVEN: {
          description:
            "This function rounds the specified value up to the nearest even integer.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        EXACT: {
          description:
            "This function returns true if two strings are the same; otherwise, false.",
          parameters: [
            {
              name: "text1"
            },
            {
              name: "text2"
            }
          ]
        },
        EXP: {
          description:
            "This function returns e raised to the power of the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        EXPONDIST: {
          description:
            "This function returns the exponential distribution or the probability density.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "lambda"
            },
            {
              name: "cumulative"
            }
          ]
        },
        FACT: {
          description:
            "This function calculates the factorial of the specified number.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        FACTDOUBLE: {
          description:
            "This function calculates the double factorial of the specified number.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        FALSE: {
          description: "This function returns the value for logical FALSE.",
          parameters: []
        },
        FDIST: {
          description:
            "This function calculates the F probability distribution, to see degrees of diversity between two sets of data.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "degnum"
            },
            {
              name: "degden"
            }
          ]
        },
        FIND: {
          description:
            "This function finds one text value within another and returns the text value’s position in the text you searched.",
          parameters: [
            {
              name: "findtext"
            },
            {
              name: "intext"
            },
            {
              name: "start"
            }
          ]
        },
        FINV: {
          description:
            "This function returns the inverse of the F probability distribution.",
          parameters: [
            {
              name: "p"
            },
            {
              name: "degnum"
            },
            {
              name: "degden"
            }
          ]
        },
        FISHER: {
          description:
            "This function returns the Fisher transformation for a specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        FISHERINV: {
          description:
            "This function returns the inverse of the Fisher transformation for a specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        FIXED: {
          description:
            "This function rounds a number to the specified number of decimal places, formats the number in decimal format using a period and commas (if so specified), and returns the result as text.",
          parameters: [
            {
              name: "num"
            },
            {
              name: "digits"
            },
            {
              name: "notcomma"
            }
          ]
        },
        FLOOR: {
          description:
            "This function rounds a number down to the nearest multiple of a specified value.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "signif"
            }
          ]
        },
        FORECAST: {
          description:
            "This function calculates a future value using existing values.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "Yarray"
            },
            {
              name: "Xarray"
            }
          ]
        },
        FREQUENCY: {
          description:
            "This function calculates how often values occur within a range of values. This function returns a vertical array of numbers.",
          parameters: [
            {
              name: "dataarray"
            },
            {
              name: "binarray"
            }
          ]
        },
        FTEST: {
          description:
            "This function returns the result of an F-test, which returns the one-tailed probability that the variances in two arrays are not significantly different.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        FV: {
          description:
            "This function returns the future value of an investment based on a present value, periodic payments, and a specified interest rate.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "numper"
            },
            {
              name: "paymt"
            },
            {
              name: "pval"
            },
            {
              name: "type"
            }
          ]
        },
        FVSCHEDULE: {
          description:
            "This function returns the future value of an initial principal after applying a series of compound interest rates. Calculate future value of an investment with a variable or adjustable rate.",
          parameters: [
            {
              name: "principal"
            },
            {
              name: "schedule"
            }
          ]
        },
        GAMMADIST: {
          description: "This function returns the gamma distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "cumulative"
            }
          ]
        },
        GAMMAINV: {
          description:
            "This function returns the inverse of the gamma cumulative distribution.",
          parameters: [
            {
              name: "p"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            }
          ]
        },
        GAMMALN: {
          description:
            "This function returns the natural logarithm of the Gamma function, G(x).",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        GCD: {
          description:
            "This function returns the greatest common divisor of two numbers.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        GEOMEAN: {
          description:
            "This function returns the geometric mean of a set of positive data.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        GESTEP: {
          description:
            "This function, greater than or equal to step, returns an indication of whether a number is equal to a threshold.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "step"
            }
          ]
        },
        GROWTH: {
          description:
            "This function calculates predicted exponential growth. This function returns the y values for a series of new x values that are specified by using existing x and y values.",
          parameters: [
            {
              name: "y"
            },
            {
              name: "x"
            },
            {
              name: "newx"
            },
            {
              name: "constant"
            }
          ]
        },
        HARMEAN: {
          description: "This function returns the harmonic mean of a data set.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        HEX2BIN: {
          description:
            "This function converts a hexadecimal number to a binary number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: " places"
            }
          ]
        },
        HEX2DEC: {
          description:
            "This function converts a hexadecimal number to a decimal number.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        HEX2OCT: {
          description:
            "This function converts a hexadecimal number to an octal number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: " places"
            }
          ]
        },
        HLOOKUP: {
          description:
            "This function searches for a value in the top row and then returns a value in the same column from a specified row.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "array"
            },
            {
              name: "row"
            },
            {
              name: "approx"
            }
          ]
        },
        HOUR: {
          description:
            "This function returns the hour that corresponds to a specified time.",
          parameters: [
            {
              name: "time"
            }
          ]
        },
        HYPGEOMDIST: {
          description: "This function returns the hypergeometric distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "n"
            },
            {
              name: "M"
            },
            {
              name: "N"
            }
          ]
        },
        IF: {
          description:
            "This function performs a comparison and returns one of two provided values based on that comparison.",
          parameters: [
            {
              name: "valueTest"
            },
            {
              name: "valueTrue"
            },
            {
              name: "valueFalse"
            }
          ]
        },
        IFERROR: {
          description:
            "This function evaluates a formula and returns a value you provide if there is an error or the formula result.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "error"
            }
          ]
        },
        IMABS: {
          description:
            "This function returns the absolute value or modulus of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMAGINARY: {
          description:
            "This function returns the imaginary coefficient of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMARGUMENT: {
          description:
            "This function returns the argument theta, which is an angle expressed in radians.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMCONJUGATE: {
          description:
            "This function returns the complex conjugate of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMCOS: {
          description: "This function returns the cosine of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMDIV: {
          description:
            "This function returns the quotient of two complex numbers.",
          parameters: [
            {
              name: "complexnum"
            },
            {
              name: "complexdenom"
            }
          ]
        },
        IMEXP: {
          description:
            "This function returns the exponential of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMLN: {
          description:
            "This function returns the natural logarithm of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMLOG2: {
          description:
            "This function returns the base-2 logarithm of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMLOG10: {
          description:
            "This function returns the common logarithm of a complex number.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMPOWER: {
          description:
            "This function returns a complex number raised to a power.",
          parameters: [
            {
              name: "complexnum"
            },
            {
              name: "powernum"
            }
          ]
        },
        IMPRODUCT: {
          description:
            "This function returns the product of up to 29 complex numbers in the x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum1"
            },
            {
              name: "complexnum2",
              repeatable: true
            }
          ]
        },
        IMREAL: {
          description:
            "This function returns the real coefficient of a complex number in the x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMSIN: {
          description:
            "This function returns the sine of a complex number in the x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMSQRT: {
          description:
            "This function returns the square root of a complex number in the x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMSUB: {
          description:
            "This function returns the difference of two complex numbers in the x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum1"
            },
            {
              name: "complexnum2"
            }
          ]
        },
        IMSUM: {
          description:
            "This function returns the sum of two or more complex numbers in the x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum1"
            },
            {
              name: "complexnum2",
              repeatable: true
            }
          ]
        },
        INDEX: {
          description:
            "This function returns a value or the reference to a value from within an array or range.",
          parameters: [
            {
              name: "return"
            },
            {
              name: "row"
            },
            {
              name: "col"
            },
            {
              name: "area"
            }
          ]
        },
        INDIRECT: {
          description:
            "This function returns the reference specified by a text string. References are immediately evaluated to display their contents.",
          parameters: [
            {
              name: "ref_text"
            },
            {
              name: "a1_style"
            }
          ]
        },
        INT: {
          description:
            "This function rounds a specified number down to the nearest integer.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        INTERCEPT: {
          description:
            "This function returns the coordinates of a point at which a line intersects the y-axis, by using existing x values and y values.",
          parameters: [
            {
              name: "dependent"
            },
            {
              name: "independent"
            }
          ]
        },
        INTRATE: {
          description:
            "This function calculates the interest rate for a fully invested security.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "invest"
            },
            {
              name: "redeem"
            },
            {
              name: "basis"
            }
          ]
        },
        IPMT: {
          description:
            "This function calculates the payment of interest on a loan.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "per"
            },
            {
              name: "nper"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            },
            {
              name: "type"
            }
          ]
        },
        IRR: {
          description:
            "This function returns the internal rate of return for a series of cash flows represented by the numbers in an array.",
          parameters: [
            {
              name: "arrayvals"
            },
            {
              name: "estimate"
            }
          ]
        },
        ISBLANK: {
          description:
            "This function tests whether a value, an expression, or contents of a referenced cell is empty.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISERR: {
          description:
            "This function, Is Error Other Than Not Available, tests whether a value, an expression, or contents of a referenced cell has an error other than not available (#N/A).",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISERROR: {
          description:
            "This function, Is Error of Any Kind, tests whether a value, an expression, or contents of a referenced cell has an error of any kind.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISEVEN: {
          description:
            "This function, Is Number Even, tests whether a value, an expression, or contents of a referenced cell is even.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISLOGICAL: {
          description:
            "This function tests whether a value, an expression, or contents of a referenced cell is a logical (Boolean) value.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISNA: {
          description:
            "This function, Is Not Available, tests whether a value, an expression, or contents of a referenced cell has the not available (#N/A) error value.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISNONTEXT: {
          description:
            "This function tests whether a value, an expression, or contents of a referenced cell has any data type other than text.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISNUMBER: {
          description:
            "This function tests whether a value, an expression, or contents of a referenced cell has numeric data.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISODD: {
          description:
            "This function, Is Number Odd, tests whether a value, an expression, or contents of a referenced cell has numeric data.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISPMT: {
          description:
            "This function calculates the interest paid during a specific period of an investment.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "per"
            },
            {
              name: "nper"
            },
            {
              name: "pv"
            }
          ]
        },
        ISREF: {
          description:
            "This function, Is Reference, tests whether a value, an expression, or contents of a referenced cell is a reference to another cell.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        ISTEXT: {
          description:
            "This function tests whether a value, an expression, or contents of a referenced cell has text data.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        KURT: {
          description: "This function returns the kurtosis of a data set.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2"
            },
            {
              name: "value3"
            },
            {
              name: "value4",
              repeatable: true
            }
          ]
        },
        LARGE: {
          description:
            "This function returns the nth largest value in a data set, where n is specified.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            }
          ]
        },
        LCM: {
          description:
            "This function returns the least common multiple of two numbers.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        LEFT: {
          description:
            "This function returns the specified leftmost characters from a text value, and based on the number of characters you specify.",
          parameters: [
            {
              name: "mytext"
            },
            {
              name: "num_chars"
            }
          ]
        },
        LEN: {
          description:
            "This function returns the length of the number of characters in a text string.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        LINEST: {
          description: "This function calculates the statistics for a line.",
          parameters: [
            {
              name: "y"
            },
            {
              name: "x"
            },
            {
              name: "constant"
            },
            {
              name: "stats"
            }
          ]
        },
        LN: {
          description:
            "This function returns the natural logarithm of the specified number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        LOG: {
          description:
            "This function returns the logarithm base Y of a number X.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "base"
            }
          ]
        },
        LOG10: {
          description:
            "This function returns the logarithm base 10 of the number given.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        LOGEST: {
          description:
            "This function calculates an exponential curve that fits the data and returns an array of values that describes the curve.",
          parameters: [
            {
              name: "y"
            },
            {
              name: "x"
            },
            {
              name: "constant"
            },
            {
              name: "stats"
            }
          ]
        },
        LOGINV: {
          description:
            "This function returns the inverse of the lognormal cumulative distribution function of x, where LN(x) is normally distributed with the specified mean and standard deviation.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            }
          ]
        },
        LOGNORMDIST: {
          description:
            "This function returns the cumulative natural log normal distribution of x, where LN(x) is normally distributed with the specified mean and standard deviation. Analyze data that has been logarithmically transformed with this function.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            }
          ]
        },
        LOOKUP: {
          description:
            "This function searches for a value and returns a value from the same location in a second area.",
          parameters: [
            {
              name: "lookupvalue"
            },
            {
              name: "lookupvector"
            },
            {
              name: "resultvector"
            }
          ]
        },
        LOWER: {
          description: "This function converts text to lower case letters.",
          parameters: [
            {
              name: "string"
            }
          ]
        },
        MATCH: {
          description:
            "This function returns the relative position of a specified item in a range.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "array"
            },
            {
              name: "type"
            }
          ]
        },
        MAX: {
          description:
            "This function returns the maximum value, the greatest value, of all the values in the arguments.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        MAXA: {
          description:
            "This function returns the largest value in a list of arguments, including text and logical values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        MDETERM: {
          description:
            "This function returns the matrix determinant of an array.",
          parameters: [
            {
              name: "array"
            }
          ]
        },
        MDURATION: {
          description:
            "This function calculates the modified Macaulay duration of a security with an assumed par value of $100.",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "coupon"
            },
            {
              name: "yield"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        MEDIAN: {
          description:
            "This function returns the median, the number in the middle of the provided set of numbers; that is, half the numbers have values that are greater than the median, and half have values that are less than the median.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        MID: {
          description:
            "This function returns the requested number of characters from a text string starting at the position you specify, and based on the number of characters you specify.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "start_num"
            },
            {
              name: "num_chars"
            }
          ]
        },
        MIN: {
          description:
            "This function returns the minimum value, the least value, of all the values in the arguments.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        MINA: {
          description:
            "This function returns the minimum value in a list of arguments, including text and logical values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        MINUTE: {
          description:
            "This function returns the minute corresponding to a specified time.",
          parameters: [
            {
              name: "time"
            }
          ]
        },
        MINVERSE: {
          description:
            "This function returns the inverse matrix for the matrix stored in an array.",
          parameters: [
            {
              name: "array"
            }
          ]
        },
        MIRR: {
          description:
            "This function returns the modified internal rate of return for a series of periodic cash flows.",
          parameters: [
            {
              name: "arrayvals"
            },
            {
              name: "payment_int"
            },
            {
              name: "income_int"
            }
          ]
        },
        MMULT: {
          description:
            "This function returns the matrix product for two arrays.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        MOD: {
          description:
            "This function returns the remainder of a division operation.",
          parameters: [
            {
              name: "dividend"
            },
            {
              name: "divisor"
            }
          ]
        },
        MODE: {
          description:
            "This function returns the most frequently occurring value in a set of data.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        MONTH: {
          description:
            "This function returns the month corresponding to the specified date value.",
          parameters: [
            {
              name: "date"
            }
          ]
        },
        MROUND: {
          description:
            "This function returns a number rounded to the desired multiple.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "multiple"
            }
          ]
        },
        MULTINOMIAL: {
          description:
            "This function calculates the ratio of the factorial of a sum of values to the product of factorials.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        N: {
          description: "This function returns a value converted to a number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        NA: {
          description:
            "This function returns the error value #N/A that means not available.",
          parameters: []
        },
        NEGBINOMDIST: {
          description:
            "This function returns the negative binomial distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "r"
            },
            {
              name: "p"
            }
          ]
        },
        NETWORKDAYS: {
          description:
            "This function returns the total number of complete working days between the start and end dates.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "enddate"
            },
            {
              name: "holidays"
            }
          ]
        },
        NOMINAL: {
          description:
            "This function returns the nominal annual interest rate for a given effective rate and number of compounding periods per year.",
          parameters: [
            {
              name: "effrate"
            },
            {
              name: "comper"
            }
          ]
        },
        NORMDIST: {
          description:
            "This function returns the normal cumulative distribution for the specified mean and standard deviation.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            },
            {
              name: "cumulative"
            }
          ]
        },
        NORMINV: {
          description:
            "This function returns the inverse of the normal cumulative distribution for the given mean and standard deviation.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            }
          ]
        },
        NORMSDIST: {
          description:
            "This function returns the standard normal cumulative distribution function.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        NORMSINV: {
          description:
            "This function returns the inverse of the standard normal cumulative distribution. The distribution has a mean of zero and a standard deviation of one.",
          parameters: [
            {
              name: "prob"
            }
          ]
        },
        NOT: {
          description:
            "This function reverses the logical value of its argument.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        NOW: {
          description: "This function returns the current date and time.",
          parameters: []
        },
        NPER: {
          description:
            "This function returns the number of periods for an investment based on a present value, future value, periodic payments, and a specified interest rate.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "paymt"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            },
            {
              name: "type"
            }
          ]
        },
        NPV: {
          description:
            "This function calculates the net present value of an investment by using a discount rate and a series of future payments and income.",
          parameters: [
            {
              name: "discount"
            },
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        OCT2BIN: {
          description:
            "This function converts an octal number to a binary number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        OCT2DEC: {
          description:
            "This function converts an octal number to a decimal number.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        OCT2HEX: {
          description:
            "This function converts an octal number to a hexadecimal number.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "places"
            }
          ]
        },
        ODD: {
          description:
            "This function rounds the specified value up to the nearest odd integer.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ODDFPRICE: {
          description:
            "This function calculates the price per $100 face value of a security with an odd first period.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "issue"
            },
            {
              name: "first"
            },
            {
              name: "rate"
            },
            {
              name: "yield"
            },
            {
              name: "redeem"
            },
            {
              name: "freq"
            },
            {
              name: "basis"
            }
          ]
        },
        ODDFYIELD: {
          description:
            "This function calculates the yield of a security with an odd first period.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "issue"
            },
            {
              name: "first"
            },
            {
              name: "rate"
            },
            {
              name: "price"
            },
            {
              name: "redeem"
            },
            {
              name: "freq"
            },
            {
              name: "basis"
            }
          ]
        },
        ODDLPRICE: {
          description:
            "This function calculates the price per $100 face value of a security with an odd last coupon period.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "last"
            },
            {
              name: "rate"
            },
            {
              name: "yield"
            },
            {
              name: "redeem"
            },
            {
              name: "freq"
            },
            {
              name: "basis"
            }
          ]
        },
        ODDLYIELD: {
          description:
            "This function calculates the yield of a security with an odd last period.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "last"
            },
            {
              name: "rate"
            },
            {
              name: "price"
            },
            {
              name: "redeem"
            },
            {
              name: "freq"
            },
            {
              name: "basis"
            }
          ]
        },
        OFFSET: {
          description:
            "This function returns a reference to a range. The range is a specified number of rows and columns from a cell or range of cells. The function returns a single cell or a range of cells.",
          parameters: [
            {
              name: "reference"
            },
            {
              name: "rows"
            },
            {
              name: "cols"
            },
            {
              name: "height"
            },
            {
              name: "width"
            }
          ]
        },
        OR: {
          description:
            "This function calculates logical OR. It returns TRUE if any of its arguments are true; otherwise, returns FALSE if all arguments are false.",
          parameters: [
            {
              name: "argument1"
            },
            {
              name: "argument2..."
            }
          ]
        },
        PEARSON: {
          description:
            "This function returns the Pearson product moment correlation coefficient, a dimensionless index between -1.0 to 1.0 inclusive indicative of the linear relationship of two data sets.",
          parameters: [
            {
              name: "array_ind"
            },
            {
              name: "array_dep"
            }
          ]
        },
        PERCENTILE: {
          description:
            "This function returns the nth percentile of values in a range.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            }
          ]
        },
        PERCENTRANK: {
          description:
            "This function returns the rank of a value in a data set as a percentage of the data set.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            },
            {
              name: "sigdig"
            }
          ]
        },
        PERMUT: {
          description:
            "This function returns the number of possible permutations for a specified number of items.",
          parameters: [
            {
              name: "k"
            },
            {
              name: "n"
            }
          ]
        },
        PI: {
          description: "This function returns PI as 3.1415926536.",
          parameters: []
        },
        PMT: {
          description:
            "This function returns the payment amount for a loan given the present value, specified interest rate, and number of terms.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "nper"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            },
            {
              name: "type"
            }
          ]
        },
        POISSON: {
          description: "This function returns the Poisson distribution.",
          parameters: [
            {
              name: "nevents"
            },
            {
              name: "mean"
            },
            {
              name: "cumulative"
            }
          ]
        },
        POWER: {
          description:
            "This function raises the specified number to the specified power.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "power"
            }
          ]
        },
        PPMT: {
          description:
            "This function returns the amount of payment of principal for a loan given the present value, specified interest rate, and number of terms.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "per"
            },
            {
              name: "nper"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            },
            {
              name: "type"
            }
          ]
        },
        PRICE: {
          description:
            "This function calculates the price per $100 face value of a periodic interest security",
          parameters: [
            {
              name: "settlement"
            },
            {
              name: "maturity"
            },
            {
              name: "rate"
            },
            {
              name: "yield"
            },
            {
              name: "redeem"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        PRICEDISC: {
          description:
            "This function returns the price per $100 face value of a discounted security.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "discount"
            },
            {
              name: "redeem"
            },
            {
              name: "basis"
            }
          ]
        },
        PRICEMAT: {
          description:
            "This function returns the price at maturity per $100 face value of a security that pays interest.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "issue"
            },
            {
              name: "rate"
            },
            {
              name: "yield"
            },
            {
              name: "basis"
            }
          ]
        },
        PROB: {
          description:
            "This function returns the probability that values in a range are between two limits.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "probs"
            },
            {
              name: "lower"
            },
            {
              name: "upper"
            }
          ]
        },
        PRODUCT: {
          description:
            "This function multiplies all the arguments and returns the product.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        PROPER: {
          description:
            "This function capitalizes the first letter in each word of a text string.",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        PV: {
          description:
            "This function returns the present value of an investment based on the interest rate, number and amount of periodic payments, and future value. The present value is the total amount that a series of future payments is worth now.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "numper"
            },
            {
              name: "paymt"
            },
            {
              name: "fval"
            },
            {
              name: "type"
            }
          ]
        },
        QUARTILE: {
          description:
            "This function returns which quartile (which quarter or 25 percent) of a data set a value is.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "quart"
            }
          ]
        },
        QUOTIENT: {
          description:
            "This function returns the integer portion of a division. Use this to ignore the remainder of a division.",
          parameters: [
            {
              name: "numerator"
            },
            {
              name: "denominator"
            }
          ]
        },
        RADIANS: {
          description:
            "This function converts the specified number from degrees to radians.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        RAND: {
          description:
            "This function returns an evenly distributed random number between 0 and 1.",
          parameters: []
        },
        RANDBETWEEN: {
          description:
            "This function returns a random number between the numbers you specify.",
          parameters: [
            {
              name: "lower"
            },
            {
              name: "upper"
            }
          ]
        },
        RANK: {
          description:
            "This function returns the rank of a number in a set of numbers. If you were to sort the set, the rank of the number would be its position in the list.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "array"
            },
            {
              name: "order"
            }
          ]
        },
        RATE: {
          description:
            "This function returns the interest rate per period of an annuity.",
          parameters: [
            {
              name: "nper"
            },
            {
              name: "pmt"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            },
            {
              name: "type"
            },
            {
              name: "guess"
            }
          ]
        },
        RECEIVED: {
          description:
            "This function returns the amount received at maturity for a fully invested security.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "invest"
            },
            {
              name: "discount"
            },
            {
              name: "basis"
            }
          ]
        },
        REPLACE: {
          description:
            "This function replaces part of a text string with a different text string, based on the number of characters you specify.",
          parameters: [
            {
              name: "old_text"
            },
            {
              name: "start_char"
            },
            {
              name: "num_chars"
            },
            {
              name: "new_text"
            }
          ]
        },
        REPT: {
          description:
            "This function repeats text a specified number of times.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "number"
            }
          ]
        },
        RIGHT: {
          description:
            "This function returns the specified rightmost characters from a text value, and based on the number of characters you specify.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "num_chars"
            }
          ]
        },
        ROMAN: {
          description:
            "This function converts an Arabic numeral to a Roman numeral text equivalent.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "style"
            }
          ]
        },
        ROUND: {
          description:
            "This function rounds the specified value to the nearest number, using the specified number of decimal places.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "places"
            }
          ]
        },
        ROUNDDOWN: {
          description:
            "This function rounds the specified number down to the nearest number, using the specified number of decimal places.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "places"
            }
          ]
        },
        ROUNDUP: {
          description:
            "This function rounds the specified number up to the nearest number, using the specified number of decimal places.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "places"
            }
          ]
        },
        ROW: {
          description:
            "This function returns the number of a row from a reference.",
          parameters: [
            {
              name: "reference"
            }
          ]
        },
        ROWS: {
          description: "This function returns the number of rows in an array.",
          parameters: [
            {
              name: "array"
            }
          ]
        },
        RSQ: {
          description:
            "This function returns the square of the Pearson product moment correlation coefficient (R-squared) through data points in known y�s and known x�s.",
          parameters: [
            {
              name: "array_dep"
            },
            {
              name: "array_ind"
            }
          ]
        },
        SEARCH: {
          description:
            "This function finds one text string in another text string and returns the index of the starting position of the found text.",
          parameters: [
            {
              name: "string1"
            },
            {
              name: "string2"
            }
          ]
        },
        SECOND: {
          description:
            "This function returns the seconds (0 to 59) value for a specified time.",
          parameters: [
            {
              name: "time"
            }
          ]
        },
        SERIESSUM: {
          description: "This function returns the sum of a power series.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "n"
            },
            {
              name: "m"
            },
            {
              name: "coeff"
            }
          ]
        },
        SIGN: {
          description:
            "This function returns the sign of a number or expression.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        SIN: {
          description: "This function returns the sine of the specified angle.",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        SINH: {
          description:
            "This function returns the hyperbolic sine of the specified number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        SKEW: {
          description: "This function returns the skewness of a distribution.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2",
              repeatable: true
            }
          ]
        },
        SLN: {
          description:
            "This function returns the straight-line depreciation of an asset for one period.",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "salvage"
            },
            {
              name: "life"
            }
          ]
        },
        SLOPE: {
          description:
            "This function calculates the slope of a linear regression.",
          parameters: [
            {
              name: "array_dep"
            },
            {
              name: "array_ind"
            }
          ]
        },
        SMALL: {
          description:
            "This function returns the nth smallest value in a data set, where n is specified.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            }
          ]
        },
        SQRT: {
          description:
            "This function returns the positive square root of the specified number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        SQRTPI: {
          description:
            "This function returns the positive square root of a multiple of pi (p).",
          parameters: [
            {
              name: "multiple"
            }
          ]
        },
        STANDARDIZE: {
          description:
            "This function returns a normalized value from a distribution characterized by mean and standard deviation.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            }
          ]
        },
        STDEVA: {
          description:
            "This function returns the standard deviation for a set of numbers, text, or logical values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        STDEVP: {
          description:
            "This function returns the standard deviation for an entire specified population (of numeric values).",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        STDEVPA: {
          description:
            "This function returns the standard deviation for an entire specified population, including text or logical values as well as numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        STEYX: {
          description:
            "This function returns the standard error of the predicted y value for each x. The standard error is a measure of the amount of error in the prediction of y for a value of x.",
          parameters: [
            {
              name: "array_dep"
            },
            {
              name: "array_ind"
            }
          ]
        },
        SUBSTITUTE: {
          description:
            "This function substitutes a new string for specified characters in an existing string.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "old_piece"
            },
            {
              name: "new_piece"
            },
            {
              name: "instance"
            }
          ]
        },
        SUBTOTAL: {
          description:
            "This function calculates a subtotal of a list of numbers using a specified built-in function.",
          parameters: [
            {
              name: "functioncode"
            },
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        SUM: {
          description:
            "This function returns the sum of cells or range of cells.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        SUMIF: {
          description: "This function adds the cells using a given criteria.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "condition"
            },
            {
              name: "sumrange"
            }
          ]
        },
        SUMIFS: {
          description:
            "This function adds the cells in a range using multiple criteria.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "conditionarray"
            },
            {
              name: "condition",
              repeatable: true
            }
          ]
        },
        SUMPRODUCT: {
          description:
            "This function returns the sum of products of cells. Multiplies corresponding components in the given arrays, and returns the sum of those products.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2",
              repeatable: true
            }
          ]
        },
        SUMSQ: {
          description:
            "This function returns the sum of the squares of the arguments.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        SUMX2MY2: {
          description:
            "This function returns the sum of the difference of the squares of corresponding values in two arrays.",
          parameters: [
            {
              name: "array_x"
            },
            {
              name: "array_y"
            }
          ]
        },
        SUMX2PY2: {
          description:
            "This function returns the sum of the sum of squares of corresponding values in two arrays.",
          parameters: [
            {
              name: "array_x"
            },
            {
              name: "array_y"
            }
          ]
        },
        SUMXMY2: {
          description:
            "This function returns the sum of the square of the differences of corresponding values in two arrays.",
          parameters: [
            {
              name: "array_x"
            },
            {
              name: "array_y"
            }
          ]
        },
        SYD: {
          description:
            "This function returns the sum-of-years� digits depreciation of an asset for a specified period.",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "salvage"
            },
            {
              name: "life"
            },
            {
              name: "period"
            }
          ]
        },
        T: {
          description: "This function returns the text in a specified cell.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        TAN: {
          description:
            "This function returns the tangent of the specified angle.",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        TANH: {
          description:
            "This function returns the hyperbolic tangent of the specified number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        TBILLEQ: {
          description:
            "This function returns the equivalent yield for a Treasury bill (or T-bill)",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "discount"
            }
          ]
        },
        TBILLPRICE: {
          description:
            "This function returns the price per $100 face value for a Treasury bill (or T-bill).",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "discount"
            }
          ]
        },
        TBILLYIELD: {
          description:
            "This function returns the yield for a Treasury bill (or T-bill).",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "mature"
            },
            {
              name: "priceper"
            }
          ]
        },
        TDIST: {
          description:
            "This function returns the probability for the t-distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "deg"
            },
            {
              name: "tails"
            }
          ]
        },
        TEXT: {
          description:
            "This function formats a number and converts it to text.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "text"
            }
          ]
        },
        TIME: {
          description:
            "This function returns the TimeSpan object for a specified time.",
          parameters: [
            {
              name: "hour"
            },
            {
              name: "minutes"
            },
            {
              name: "seconds"
            }
          ]
        },
        TIMEVALUE: {
          description:
            "This function returns the TimeSpan object of the time represented by a text string.",
          parameters: [
            {
              name: "time_string"
            }
          ]
        },
        TINV: {
          description:
            "This function returns the t-value of the student's t-distribution as a function of the probability and the degrees of freedom.",
          parameters: [
            {
              name: "prog"
            },
            {
              name: "deg"
            }
          ]
        },
        TODAY: {
          description:
            "This function returns the date and time of the current date.",
          parameters: []
        },
        TRANSPOSE: {
          description:
            "This function returns a vertical range of cells as a horizontal range or a horizontal range of cells as a vertical range.",
          parameters: [
            {
              name: "array"
            }
          ]
        },
        TREND: {
          description:
            "This function returns values along a linear trend. This function fits a straight line to the arrays known x and y values. Trend returns the y values along that line for the array of specified new x values.",
          parameters: [
            {
              name: "y"
            },
            {
              name: "x"
            },
            {
              name: "newx"
            },
            {
              name: "constant"
            }
          ]
        },
        TRIM: {
          description:
            "This function removes extra spaces from a string and leaves single spaces between words.",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        TRIMMEAN: {
          description:
            "This function returns the mean of a subset of data excluding the top and bottom data.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "percent"
            }
          ]
        },
        TRUE: {
          description: "This function returns the value for logical TRUE.",
          parameters: []
        },
        TRUNC: {
          description:
            "This function removes the specified fractional part of the specified number.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "precision"
            }
          ]
        },
        TTEST: {
          description:
            "This function returns the probability associated with a t-test.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            },
            {
              name: "tails"
            },
            {
              name: "type"
            }
          ]
        },
        TYPE: {
          description: "This function returns the type of value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        UPPER: {
          description: "This function converts text to uppercase letters.",
          parameters: [
            {
              name: "string"
            }
          ]
        },
        VALUE: {
          description:
            "This function converts a text string that is a number to a numeric value.",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        VAR: {
          description:
            "This function returns the variance based on a sample of a population, which uses only numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        VARA: {
          description:
            "This function returns the variance based on a sample of a population, which includes numeric, logical, or text values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        VARP: {
          description:
            "This function returns variance based on the entire population, which uses only numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        VARPA: {
          description:
            "This function returns variance based on the entire population, which includes numeric, logical, or text values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        VDB: {
          description:
            "This function returns the depreciation of an asset for any period you specify using the variable declining balance method.",
          parameters: [
            {
              name: "cost"
            },
            {
              name: "salvage"
            },
            {
              name: "life"
            },
            {
              name: "start"
            },
            {
              name: "end"
            },
            {
              name: "factor"
            },
            {
              name: "switchnot"
            }
          ]
        },
        VLOOKUP: {
          description:
            "This function searches for a value in the leftmost column and returns a value in the same row from a column you specify.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "array"
            },
            {
              name: "colindex"
            },
            {
              name: "approx"
            }
          ]
        },
        WEEKDAY: {
          description:
            "This function returns the number corresponding to the day of the week for a specified date.",
          parameters: [
            {
              name: "date"
            },
            {
              name: "type"
            }
          ]
        },
        WEEKNUM: {
          description:
            "This function returns a number that indicates the week of the year numerically.",
          parameters: [
            {
              name: "date"
            },
            {
              name: "weektype"
            }
          ]
        },
        WEIBULL: {
          description:
            "This function returns the two-parameter Weibull distribution, often used in reliability analysis.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "cumulative"
            }
          ]
        },
        WORKDAY: {
          description:
            "This function returns the number of working days before or after the starting date.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "numdays"
            },
            {
              name: "holidays"
            }
          ]
        },
        XIRR: {
          description:
            "This function calculates the internal rate of return for a schedule of cash flows that may not be periodic.",
          parameters: [
            {
              name: "values"
            },
            {
              name: "dates"
            },
            {
              name: "guess"
            }
          ]
        },
        XNPV: {
          description:
            "This function calculates the net present value for a schedule of cash flows that may not be periodic.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "values"
            },
            {
              name: "dates"
            }
          ]
        },
        YEAR: {
          description:
            "This function returns the year as an integer for a specified date.",
          parameters: [
            {
              name: "date"
            }
          ]
        },
        YEARFRAC: {
          description:
            "This function returns the fraction of the year represented by the number of whole days between the start and end dates.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "enddate"
            },
            {
              name: "basis"
            }
          ]
        },
        YIELD: {
          description:
            "This function calculates the yield on a security that pays periodic interest.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "rate"
            },
            {
              name: "price"
            },
            {
              name: "redeem"
            },
            {
              name: "frequency"
            },
            {
              name: "basis"
            }
          ]
        },
        YIELDDISC: {
          description:
            "This function calculates the annual yield for a discounted security.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "price"
            },
            {
              name: "redeem"
            },
            {
              name: "basis"
            }
          ]
        },
        YIELDMAT: {
          description:
            "This function calculates the annual yield of a security that pays interest at maturity.",
          parameters: [
            {
              name: "settle"
            },
            {
              name: "maturity"
            },
            {
              name: "issue"
            },
            {
              name: "issrate"
            },
            {
              name: "price"
            },
            {
              name: "basis"
            }
          ]
        },
        ZTEST: {
          description:
            "This function returns the significance value of a z-test. The z-test generates a standard score for x with respect to the set of data and returns the two-tailed probability for the normal distribution.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "x"
            },
            {
              name: "sigma"
            }
          ]
        },
        HBARSPARKLINE: {
          description:
            "This function returns a data set used for representing a Hbar sparkline",
          parameters: [
            {
              name: "value"
            },
            {
              name: "colorScheme"
            }
          ]
        },
        VBARSPARKLINE: {
          description:
            "This function returns a data set used for representing a Vbar sparkline",
          parameters: [
            {
              name: "value"
            },
            {
              name: "colorScheme"
            }
          ]
        },
        VARISPARKLINE: {
          description:
            "This function returns a data set used for representing a variance sparkline",
          parameters: [
            {
              name: "variance"
            },
            {
              name: "reference"
            },
            {
              name: "mini"
            },
            {
              name: "maxi"
            },
            {
              name: "mark"
            },
            {
              name: "tickunit"
            },
            {
              name: "legend"
            },
            {
              name: "colorPositive"
            },
            {
              name: "colorNegative"
            },
            {
              name: "vertical"
            }
          ]
        },
        PIESPARKLINE: {
          description:
            "This function returns a data set used for representing a pie sparkline",
          parameters: [
            {
              name: "range|percentage"
            },
            {
              name: "color",
              repeatable: true
            }
          ]
        },
        AREASPARKLINE: {
          description:
            "This function returns a data set used for representing a area sparkline",
          parameters: [
            {
              name: "points"
            },
            {
              name: "mini"
            },
            {
              name: "maxi"
            },
            {
              name: "line1"
            },
            {
              name: "line2"
            },
            {
              name: "colorPositive"
            },
            {
              name: "colorNegative"
            }
          ]
        },
        SCATTERSPARKLINE: {
          description:
            "This function returns a data set used for representing a scatter sparkline",
          parameters: [
            {
              name: "points1"
            },
            {
              name: "points2"
            },
            {
              name: "minX"
            },
            {
              name: "maxX"
            },
            {
              name: "minY"
            },
            {
              name: "maxY"
            },
            {
              name: "hLine"
            },
            {
              name: "vLine"
            },
            {
              name: "xMinZone"
            },
            {
              name: "xMaxZone"
            },
            {
              name: "yMinZone"
            },
            {
              name: "yMaxZone"
            },
            {
              name: "tags"
            },
            {
              name: "drawSymbol"
            },
            {
              name: "drawLines"
            },
            {
              name: "color1"
            },
            {
              name: "color2"
            },
            {
              name: "dash"
            }
          ]
        },
        LINESPARKLINE: {
          description:
            "This function returns a data set used for representing a line sparkline",
          parameters: [
            {
              name: "data"
            },
            {
              name: "dataOrientation"
            },
            {
              name: "dateAxisData"
            },
            {
              name: "dateAxisOrientation"
            },
            {
              name: "setting"
            }
          ]
        },
        COLUMNSPARKLINE: {
          description:
            "This function returns a data set used for representing a column sparkline",
          parameters: [
            {
              name: "data"
            },
            {
              name: "dataOrientation"
            },
            {
              name: "dateAxisData"
            },
            {
              name: "dateAxisOrientation"
            },
            {
              name: "setting"
            }
          ]
        },
        WINLOSSSPARKLINE: {
          description:
            "This function returns a data set used for representing a win/loss sparkline",
          parameters: [
            {
              name: "data"
            },
            {
              name: "dataOrientation"
            },
            {
              name: "dateAxisData"
            },
            {
              name: "dateAxisOrientation"
            },
            {
              name: "setting"
            }
          ]
        },
        BULLETSPARKLINE: {
          description:
            "This function returns a data set used for representing a bullet sparkline",
          parameters: [
            {
              name: "measure"
            },
            {
              name: "target"
            },
            {
              name: "maxi"
            },
            {
              name: "good"
            },
            {
              name: "bad"
            },
            {
              name: "forecast"
            },
            {
              name: "tickunit"
            },
            {
              name: "colorScheme"
            },
            {
              name: "vertical"
            }
          ]
        },
        SPREADSPARKLINE: {
          description:
            "This function returns a data set used for representing a spread sparkline",
          parameters: [
            {
              name: "points"
            },
            {
              name: "showAverage"
            },
            {
              name: "scaleStart"
            },
            {
              name: "scaleEnd"
            },
            {
              name: "style"
            },
            {
              name: "colorScheme"
            },
            {
              name: "vertical"
            }
          ]
        },
        STACKEDSPARKLINE: {
          description:
            "This function returns a data set used for representing a stacked sparkline",
          parameters: [
            {
              name: "points"
            },
            {
              name: "colorRange"
            },
            {
              name: "labelRange"
            },
            {
              name: "maximum"
            },
            {
              name: "targetRed"
            },
            {
              name: "targetGreen"
            },
            {
              name: "targetBlue"
            },
            {
              name: "tragetYellow"
            },
            {
              name: "color"
            },
            {
              name: "highlightPosition"
            },
            {
              name: "vertical"
            },
            {
              name: "textOrientation"
            },
            {
              name: "textSize"
            }
          ]
        },
        BOXPLOTSPARKLINE: {
          description:
            "This function returns a data set used for representing a boxplot sparkline",
          parameters: [
            {
              name: "points"
            },
            {
              name: "boxPlotClass"
            },
            {
              name: "showAverage"
            },
            {
              name: "scaleStart"
            },
            {
              name: "scaleEnd"
            },
            {
              name: "acceptableStart"
            },
            {
              name: "acceptableEnd"
            },
            {
              name: "colorScheme"
            },
            {
              name: "style"
            },
            {
              name: "vertical"
            }
          ]
        },
        CASCADESPARKLINE: {
          description:
            "This function returns a data set used for representing a cascade sparkline",
          parameters: [
            {
              name: "pointsRange"
            },
            {
              name: "pointIndex"
            },
            {
              name: "labelsRange"
            },
            {
              name: "minimum"
            },
            {
              name: "maximum"
            },
            {
              name: "colorPositive"
            },
            {
              name: "colorNegative"
            },
            {
              name: "vertical"
            }
          ]
        },
        PARETOSPARKLINE: {
          description:
            "This function returns a data set used for representing a pareto sparkline",
          parameters: [
            {
              name: "points"
            },
            {
              name: "pointIndex"
            },
            {
              name: "colorRange"
            },
            {
              name: "target"
            },
            {
              name: "target2"
            },
            {
              name: "highlightPosition"
            },
            {
              name: "label"
            },
            {
              name: "vertical"
            }
          ]
        },
        MONTHSPARKLINE: {
          description:
            "This function returns a data set used for representing a month sparkline",
          parameters: [
            {
              name: "year"
            },
            {
              name: "month"
            },
            {
              name: "dataRange"
            },
            {
              name: "emptyColor"
            },
            {
              name: "startColor"
            },
            {
              name: "middleColor"
            },
            {
              name: "endColor"
            }
          ]
        },
        YEARSPARKLINE: {
          description:
            "This function returns a data set used for representing a year sparkline",
          parameters: [
            {
              name: "year"
            },
            {
              name: "dataRange"
            },
            {
              name: "emptyColor"
            },
            {
              name: "startColor"
            },
            {
              name: "middleColor"
            },
            {
              name: "endColor"
            }
          ]
        },
        "CEILING.PRECISE": {
          description:
            "This function rounds a number up to the nearest integer or to the nearest multiple of a specified value.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "signif"
            }
          ]
        },
        "COVARIANCE.S": {
          description:
            "This function returns the sample covariance, which is the average of the products of deviations for each data point pair in two sets of numbers.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        "FLOOR.PRECISE": {
          description:
            "This function rounds a number down to the nearest integer or to the nearest multiple of a specified value.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "signif"
            }
          ]
        },
        "PERCENTILE.EXC": {
          description:
            "This function returns the nth percentile of values in a range.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            }
          ]
        },
        "QUARTILE.EXC": {
          description:
            "This function returns which quartile (which quarter or 25 percent) of a data set a value is.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "quart"
            }
          ]
        },
        "RANK.AVG": {
          description:
            "This function returns the rank of a number in a set of numbers. If some values have the same rank, it will return the average rank.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "array"
            },
            {
              name: "order"
            }
          ]
        },
        "MODE.MULT": {
          description:
            "This function returns the most frequently occurring vertical array or the most frequently occurring value in a set of data.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2",
              repeatable: true
            }
          ]
        },
        "STDEV.P": {
          description:
            "This function returns the standard deviation for an entire specified population (of numeric values).",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        "VAR.P": {
          description:
            "This function returns variance based on the entire population, which uses only numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        "COVARIANCE.P": {
          description:
            "This function returns the covariance, which is the average of the products of deviations for each data point pair in two sets of numbers.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        "MODE.SNGL": {
          description:
            "This function returns the most frequently occurring value in a set of data.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        "PERCENTILE.INC": {
          description:
            "This function returns the nth percentile of values in a range.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            }
          ]
        },
        "QUARTILE.INC": {
          description:
            "This function returns which quartile (which quarter or 25 percent) of a data set a value is.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "quart"
            }
          ]
        },
        "RANK.EQ": {
          description:
            "This function returns the rank of a number in a set of numbers. If you were to sort the set, the rank of the number would be its position in the list.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "array"
            },
            {
              name: "order"
            }
          ]
        },
        STDEV: {
          description:
            "This function returns standard deviation is estimated based on a sample.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2",
              repeatable: true
            }
          ]
        },
        "STDEV.S": {
          description:
            "This function returns standard deviation is estimated based on a sample.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2",
              repeatable: true
            }
          ]
        },
        "VAR.S": {
          description:
            "This function returns the variance based on a sample of a population, which uses only numeric values.",
          parameters: [
            {
              name: "value1"
            },
            {
              name: "value2",
              repeatable: true
            }
          ]
        },
        "BETA.INV": {
          description:
            "This function calculates the inverse of the cumulative beta distribution function.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "lower"
            },
            {
              name: "upper"
            }
          ]
        },
        "BINOM.DIST": {
          description:
            "This function calculates the individual term binomial distribution probability.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "n"
            },
            {
              name: "p"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "BINOM.INV": {
          description:
            "This function returns the criterion binomial, the smallest value for which the cumulative binomial distribution is greater than or equal to a criterion value.",
          parameters: [
            {
              name: "n"
            },
            {
              name: "p"
            },
            {
              name: "alpha"
            }
          ]
        },
        "CHISQ.DIST.RT": {
          description:
            "This function calculates the one-tailed probability of the chi-squared distribution.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "deg"
            }
          ]
        },
        "CHISQ.INV.RT": {
          description:
            "This function calculates the inverse of the one-tailed probability of the chi-squared distribution.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "deg"
            }
          ]
        },
        "CHISQ.TEST": {
          description:
            "This function calculates the test for independence from the chi-squared distribution.",
          parameters: [
            {
              name: "obs_array"
            },
            {
              name: "exp_array"
            }
          ]
        },
        "CONFIDENCE.NORM": {
          description:
            "This function returns confidence interval for a population mean.",
          parameters: [
            {
              name: "alpha"
            },
            {
              name: "stdev"
            },
            {
              name: "size"
            }
          ]
        },
        "EXPON.DIST": {
          description:
            "This function returns the exponential distribution or the probability density.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "lambda"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "F.DIST.RT": {
          description:
            "This function calculates the F probability distribution, to see degrees of diversity between two sets of data.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "degnum"
            },
            {
              name: "degden"
            }
          ]
        },
        "F.INV.RT": {
          description:
            "This function returns the inverse of the F probability distribution.",
          parameters: [
            {
              name: "p"
            },
            {
              name: "degnum"
            },
            {
              name: "degden"
            }
          ]
        },
        "F.TEST": {
          description:
            "This function returns the result of an F-test, which returns the one-tailed probability that the variances in two arrays are not significantly different.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            }
          ]
        },
        "GAMMA.DIST": {
          description: "This function returns the gamma distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "GAMMA.INV": {
          description:
            "This function returns the inverse of the gamma cumulative distribution.",
          parameters: [
            {
              name: "p"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            }
          ]
        },
        "LOGNORM.INV": {
          description:
            "This function returns the inverse of the lognormal cumulative distribution function of x, where LN(x) is normally distributed with the specified mean and standard deviation.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            }
          ]
        },
        "NORM.DIST": {
          description:
            "This function returns the normal cumulative distribution for the specified mean and standard deviation.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "NORM.INV": {
          description:
            "This function returns the inverse of the normal cumulative distribution for the given mean and standard deviation.",
          parameters: [
            {
              name: "prob"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            }
          ]
        },
        "NORM.S.INV": {
          description:
            "This function returns the inverse of the standard normal cumulative distribution. The distribution has a mean of zero and a standard deviation of one.",
          parameters: [
            {
              name: "prob"
            }
          ]
        },
        "PERCENTRANK.INC": {
          description:
            "This function returns the rank of a value in a data set as a percentage of the data set.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            },
            {
              name: "signif"
            }
          ]
        },
        "POISSON.DIST": {
          description: "This function returns the Poisson distribution.",
          parameters: [
            {
              name: "nevents"
            },
            {
              name: "mean"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "T.INV.2T": {
          description:
            "This function returns the t-value of the student's t-distribution as a function of the probability and the degrees of freedom.",
          parameters: [
            {
              name: "prog"
            },
            {
              name: "deg"
            }
          ]
        },
        "T.TEST": {
          description:
            "This function returns the probability associated with a t-test.",
          parameters: [
            {
              name: "array1"
            },
            {
              name: "array2"
            },
            {
              name: "tails"
            },
            {
              name: "type"
            }
          ]
        },
        "WEIBULL.DIST": {
          description:
            "This function returns the two-parameter Weibull distribution, often used in reliability analysis.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "Z.TEST": {
          description:
            "This function returns the significance value of a z-test. The z-test generates a standard score for x with respect to the set of data and returns the two-tailed probability for the normal distribution.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "x"
            },
            {
              name: "sigma"
            }
          ]
        },
        "T.DIST.RT": {
          description: "This function returns the right-tailed t-distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "deg"
            }
          ]
        },
        "T.DIST.2T": {
          description: "This function returns the two-tailed t-distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "deg"
            }
          ]
        },
        "ISO.CEILING": {
          description:
            "This function returns a number up to the nearest integer or to the nearest multiple of significance, regardless of sign of significance.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "signif"
            }
          ]
        },
        "BETA.DIST": {
          description: "This function returns the beta distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "alpha"
            },
            {
              name: "beta"
            },
            {
              name: "cumulative"
            },
            {
              name: "lower"
            },
            {
              name: "upper"
            }
          ]
        },
        "GAMMALN.PRECISE": {
          description:
            "This function returns the natural logarithm of the gamma function.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        "ERF.PRECISE": {
          description: "This function returns the error function.",
          parameters: [
            {
              name: "lowerlimit"
            }
          ]
        },
        "ERFC.PRECISE": {
          description: "This function returns the complementary ERF function.",
          parameters: [
            {
              name: "lowerlimit"
            }
          ]
        },
        "PERCENTRANK.EXC": {
          description:
            "This function returns the percentage rank(0..1, exclusive) of a value in a data set.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "n"
            },
            {
              name: "signif"
            }
          ]
        },
        "HYPGEOM.DIST": {
          description: "This function returns the hypergeometric distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "n"
            },
            {
              name: "M"
            },
            {
              name: "N"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "LOGNORM.DIST": {
          description:
            "This function returns the log normal distribution of x.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "mean"
            },
            {
              name: "stdev"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "NEGBINOM.DIST": {
          description:
            "This function returns the negative binomial distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "r"
            },
            {
              name: "p"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "NORM.S.DIST": {
          description:
            "This function returns the standard normal distribution.",
          parameters: [
            {
              name: "z"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "T.DIST": {
          description: "This function returns the t-distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "deg"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "F.DIST": {
          description: "This function returns the F probability distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "degnum"
            },
            {
              name: "degden"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "CHISQ.DIST": {
          description: "This function returns the chi-squared distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "deg"
            },
            {
              name: "cumulative"
            }
          ]
        },
        "F.INV": {
          description:
            "This function returns the inverse of the F probability distribution.",
          parameters: [
            {
              name: "probability"
            },
            {
              name: "degnum"
            },
            {
              name: "degden"
            }
          ]
        },
        "T.INV": {
          description:
            "This function returns the left-tailed inverse of the t-distribution.",
          parameters: [
            {
              name: "probability"
            },
            {
              name: "deg"
            }
          ]
        },
        "CHISQ.INV": {
          description:
            "This function returns the inverse of left-tailed probability of the chi-squared distribution.",
          parameters: [
            {
              name: "probability"
            },
            {
              name: "deg"
            }
          ]
        },
        "CONFIDENCE.T": {
          description:
            "This function returns the confidence interval for a Student's t distribution.",
          parameters: [
            {
              name: "alpha"
            },
            {
              name: "stdev"
            },
            {
              name: "size"
            }
          ]
        },
        "NETWORKDAYS.INTL": {
          description:
            "This function returns the number of workdays between two dates using arguments to indicate holidays and weekend days.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "enddate"
            },
            {
              name: "weekend"
            },
            {
              name: "holidays"
            }
          ]
        },
        "WORKDAY.INTL": {
          description:
            "This function returns the serial number of the date before or after a number of workdays with custom weekend parameters. These parameters indicate weekend days and holidays.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "numdays"
            },
            {
              name: "weekend"
            },
            {
              name: "holidays"
            }
          ]
        },
        REFRESH: {
          description:
            "This function decides how to re-calculate the formula. Can use the evaluateMode argument to specific the formula re-calculate on the reference value changed, evaluate once , re-calculate or interval.",
          parameters: [
            {
              name: "formula"
            },
            {
              name: "evaluateMode"
            },
            {
              name: "interval"
            }
          ]
        },
        DAYS: {
          description:
            "This function returns the number of days between two dates.",
          parameters: [
            {
              name: "startdate"
            },
            {
              name: "enddate"
            }
          ]
        },
        ISOWEEKNUM: {
          description:
            "This function returns the number of the ISO week number of the year for a given date.",
          parameters: [
            {
              name: "date"
            }
          ]
        },
        BITAND: {
          description: 'This function returns a bitwise "AND" of two numbers.',
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        BITLSHIFT: {
          description: 'This function returns a bitwise "OR" of two numbers.',
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        BITOR: {
          description: 'This function returns a bitwise "OR" of two numbers.',
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        BITRSHIFT: {
          description: 'This function returns a bitwise "OR" of two numbers.',
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        BITXOR: {
          description: 'This function returns a bitwise "XOR" of two numbers.',
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2"
            }
          ]
        },
        IMCOSH: {
          description:
            "This function returns the hyperbolic cosine of a complex number in x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMCOT: {
          description:
            "This function returns the cotangent of a complex number in x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMCSC: {
          description:
            "This function returns the cosecant of a complex number in x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMCSCH: {
          description:
            "This function returns the hyperbolic cosecant of a complex number in x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMSEC: {
          description:
            "This function returns the secant of a complex number in x+yi of x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMSECH: {
          description:
            "This function returns the hyperbolic secant of a complex number in x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMSINH: {
          description:
            "This function returns the hyperbolic sine of a complex number in x+yi of x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        IMTAN: {
          description:
            "This function returns the tangent of a complex number in x+yi or x+yj text format.",
          parameters: [
            {
              name: "complexnum"
            }
          ]
        },
        PDURATION: {
          description:
            "This function returns the number of periods required by an investment to reach a specified value.",
          parameters: [
            {
              name: "rate"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            }
          ]
        },
        RRI: {
          description:
            "This function returns an equivalent interest rate for the growth of an investment.",
          parameters: [
            {
              name: "nper"
            },
            {
              name: "pval"
            },
            {
              name: "fval"
            }
          ]
        },
        ISFORMULA: {
          description:
            "This function tests whether contains a formula of a referenced cell.",
          parameters: [
            {
              name: "cellreference"
            }
          ]
        },
        IFNA: {
          description:
            "This function returns the value you specify if the formula returns the #N/A error value, otherwise returns the result of the formula.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "value_if_na"
            }
          ]
        },
        IFS: {
          description:
            "This function checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition.",
          parameters: [
            {
              name: "valueTest"
            },
            {
              name: "valueTrue"
            },
            {
              name: "...."
            }
          ]
        },
        SWITCH: {
          description:
            "This function evaluates one value for a list of values, and returns the result corresponding to the first matching value, otherwise returns the default value",
          parameters: [
            {
              name: "convertvalue"
            },
            {
              name: "matchvalue"
            },
            {
              name: "matchtrue"
            },
            {
              name: "matchfalse"
            }
          ]
        },
        XOR: {
          description:
            "This function returns a logical exclusive or of all arguments.",
          parameters: [
            {
              name: "logical"
            },
            {
              name: "...."
            }
          ]
        },
        AREAS: {
          description:
            "This function returns the number of areas in a reference.",
          parameters: [
            {
              name: "reference"
            }
          ]
        },
        FORMULATEXT: {
          description: "This function returns a formula as a string.",
          parameters: [
            {
              name: "reference"
            }
          ]
        },
        HYPERLINK: {
          description:
            "This function creates a shortcut or jump that opens a document stored on a network server, an intranet, or the Internet.",
          parameters: [
            {
              name: "link_location"
            },
            {
              name: "friendly_name"
            }
          ]
        },
        ACOT: {
          description:
            "This function calculates the inverse arccotangent of a number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ACOTH: {
          description:
            "This function calculates the inverse hyperbolic arccotangent of a number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        ARABIC: {
          description:
            "This function converts a Roman numeral text to an Arabic numeral equivalent.",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        BASE: {
          description:
            "This function converts a number into a text representation with the given radix (base).",
          parameters: [
            {
              name: "number"
            },
            {
              name: "radix"
            },
            {
              name: "minLength"
            }
          ]
        },
        "CEILING.MATH": {
          description:
            "This function round  a number up to the nearest integer or to the nearest multiple of significance.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "signif"
            },
            {
              name: "mode"
            }
          ]
        },
        COMBINA: {
          description:
            "This function calculates the number of possible combinations with repetitions for a specified number of items.",
          parameters: [
            {
              name: "number"
            },
            {
              name: "number_choosen"
            }
          ]
        },
        COT: {
          description:
            "This function returns the cotangent of the specified angle.",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        COTH: {
          description:
            "This function returns the hyperbolic cotangent of the specified number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        CSC: {
          description:
            "This function returns the cosecant of the specified angle.",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        CSCH: {
          description:
            "This function returns the hyperbolic cosecant of the specified number.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        DECIMAL: {
          description:
            "This function converts a text representation of a number in a given base into a decimal number.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "radix"
            }
          ]
        },
        "FLOOR.MATH": {
          description:
            "This function round a number down to the nearest integer or to the nearest multiple of significance.",
          parameters: [
            {
              name: "value"
            },
            {
              name: "signif"
            },
            {
              name: "mode"
            }
          ]
        },
        SEC: {
          description:
            "This function returns the secant of the specified angle.",
          parameters: [
            {
              name: "angle"
            }
          ]
        },
        SECH: {
          description:
            "This function returns the hyperbolic secant of the specified value.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        "BINOM.DIST.RANGE": {
          description:
            "This function calculates the probability of a trial result using a binomial distribution.",
          parameters: [
            {
              name: "x"
            },
            {
              name: "n"
            },
            {
              name: "p"
            },
            {
              name: "cumulative"
            }
          ]
        },
        GAMMA: {
          description: "This function returns the gamma function value.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        MAXIFS: {
          description:
            "This function returns the maximum value among cells specified by a given set of conditions or criteria.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "conditionarray"
            },
            {
              name: "condition",
              repeatable: true
            }
          ]
        },
        GAUSS: {
          description:
            "This function calculates the probability that a member of a standard normal population will fall between the mean and z standard deviations from the mean.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        MINIFS: {
          description:
            "This function returns the minimum value among cells specified by a given set of conditions or criteria.",
          parameters: [
            {
              name: "array"
            },
            {
              name: "conditionarray"
            },
            {
              name: "condition",
              repeatable: true
            }
          ]
        },
        PERMUTATIONA: {
          description:
            "This function returns the number of permutations for a given number of object that can be selected from the total objects.",
          parameters: [
            {
              name: "k"
            },
            {
              name: "n"
            }
          ]
        },
        PHI: {
          description:
            "This function returns the value of the density function for a standard normal distribution.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        "SKEW.P": {
          description:
            "This function returns the skewness of a distribution base on a poopulation: a characterization of the degree of asymmetry of a distribution around its mean.",
          parameters: [
            {
              name: "number1"
            },
            {
              name: "number2",
              repeatable: true
            }
          ]
        },
        BAHTTEXT: {
          description:
            'This function converts a number to Thai text and adds a suffix of "Baht"',
          parameters: [
            {
              name: "number"
            }
          ]
        },
        CONCAT: {
          description:
            'This function combines multiple text strings or numbers into one text string, the function will stay available for compatibility with "CONCATENATE" function.',
          parameters: [
            {
              name: "text1"
            },
            {
              name: "text2"
            },
            {
              name: "...."
            }
          ]
        },
        FINDB: {
          description:
            "This function finds one text value within another and returns the text value�s position in the text you searched, and counts each double-byte characte as 2 when set DBCS as the default language.",
          parameters: [
            {
              name: "findtext"
            },
            {
              name: "intext"
            },
            {
              name: "start"
            }
          ]
        },
        LEFTB: {
          description:
            "This function returns the specified leftmost characters from a text value, and based on the number of bytes you specify.",
          parameters: [
            {
              name: "mytext"
            },
            {
              name: "num_bytes"
            }
          ]
        },
        LENB: {
          description:
            "This function returns the length of the number of bytes in a text string.",
          parameters: [
            {
              name: "value"
            }
          ]
        },
        MIDB: {
          description:
            "This function returns the requested number of characters from a text string starting at the position you specify, and based on the number of bytes you specify.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "start_num"
            },
            {
              name: "num_bytes"
            }
          ]
        },
        REPLACEB: {
          description:
            "This function replaces part of a text string with a different text string, based on the number of bytes you specify.",
          parameters: [
            {
              name: "old_text"
            },
            {
              name: "start_byte"
            },
            {
              name: "num_bytes"
            },
            {
              name: "new_text"
            }
          ]
        },
        RIGHTB: {
          description:
            "This function returns the specified rightmost characters from a text value, and based on the number of bytes you specify.",
          parameters: [
            {
              name: "text"
            },
            {
              name: "num_bytes"
            }
          ]
        },
        SEARCHB: {
          description:
            "This function finds one text string in another text string and returns the index of the starting position of the found text, and counts each double-byte characte as 2 when set DBCS as the default language.",
          parameters: [
            {
              name: "string1"
            },
            {
              name: "string2"
            }
          ]
        },
        TEXTJOIN: {
          description:
            "This function combines multiple ranges and/or strings into one text, and the text includes a delimiter you specify between each text value.",
          parameters: [
            {
              name: "delimiter"
            },
            {
              name: "ignore_empty"
            },
            {
              name: "text1"
            },
            {
              name: "text2"
            },
            {
              name: "...."
            }
          ]
        },
        UNICHAR: {
          description:
            "This function returns the Unicode character of a given numeric reference.",
          parameters: [
            {
              name: "number"
            }
          ]
        },
        UNICODE: {
          description:
            "This function returns the number corresponding to the first character of the text.",
          parameters: [
            {
              name: "text"
            }
          ]
        },
        ENCODEURL: {
          description: "This function returns a URL-encoded string.",
          parameters: [
            {
              name: "text"
            }
          ]
        }
      }
    };
  });
});
