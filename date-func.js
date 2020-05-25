'use strict';

function minusDaysFromToday(days) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);
  
    return removeTimeFromDate(currentDate)
}
  
function removeTimeFromDate(dateTime) {

  return dateTime.setHours(0, 0, 0, 0)
}

module.exports = {
  minusDaysFromToday: minusDaysFromToday,
    removeTimeFromDate: removeTimeFromDate    
}