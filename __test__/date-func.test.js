const dateFunc = require('../date-func');

test('common date functions', () => {
    var currentDate = new Date();
    var get30Days = new Date();
    get30Days.setDate(currentDate.getDate() - 32);
    var dateWihZeroHours = currentDate.setHours(0, 0, 0, 0);
    
  expect(dateFunc.minusDaysFromToday(32)).toBe(dateFunc.removeTimeFromDate(get30Days));
  expect(dateFunc.removeTimeFromDate(currentDate)).toBe(dateWihZeroHours);
});