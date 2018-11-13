'use strict';

/**
 * Checks the status of unix timestamp
 */
const hour = 3600;
exports.timestampInfo = (timestamp, hours = 1) => {
  let now = Date.now() / 1000 | 0;
  return {
    expiring: now > (timestamp - (hour * hours)),
    expired: now > timestamp
  };
};