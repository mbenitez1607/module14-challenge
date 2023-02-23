module.exports = {
    format_date: (date) => {
      return date.toLocaleDateString();
    },
    hbsDebug: (optionalValue) => {
      console.log("Current Context");
      console.log("====================");
      console.log(this);
    
      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    },
  };
  