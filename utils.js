const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
require('dayjs/locale/fr');

exports.dayjs = (date) => {
  dayjs.extend(customParseFormat);

  return dayjs(date).locale('fr').format('D MMMM YYYY');
};
