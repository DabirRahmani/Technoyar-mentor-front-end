import React from "react";

const ConvertNumberToTime = ({ number }) => {
  if (number === null || number === undefined) return "0:00";

  var mod = number % 1;
  var integer = number - mod;

  mod = (mod * 3) / 5;

  if (mod === 0.3) mod = mod.toString() + "0";

  var modd = mod.toString().substring(2, 4);

  if (mod === 0) modd = "00";

  return "" + integer.toString() + ":" + modd;
};

export default ConvertNumberToTime;
