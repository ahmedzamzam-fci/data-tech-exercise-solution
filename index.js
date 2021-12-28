const R = require("ramda")
const csv = require("csv-parser")
const fs = require("fs")

const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));

const addDays = (date, days) => {
  let currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + days).toLocaleString();
  return currentDate.toISOString().split('T')[0];
}

const getDataSetLastIndexDate = dataSet => {
  return dataSet[dataSet.length - 1].date;
}

const getDifferenceBetweenEachRowInDataSet = dataSet => {
  let differencesInDaysArray = [];
  dataSet.forEach((dataRow, index) => {
    if (dataSet.length > index + 1) {
      differencesInDaysArray.push(diffDays(new Date(dataSet[index + 1].date), new Date(dataRow.date)));
    }
  });
  return differencesInDaysArray;
}

const getAverageDifferenceFromArray = differencesInDaysArray => {
  const sum = differencesInDaysArray.reduce((a, b) => a + b, 0);
  const avg = (sum / differencesInDaysArray.length) || 0;
  return Math.trunc(avg);
}

const groupDateWithSeriesId = seriesDate => {
  let result = [];
  seriesDate.forEach(
    seriesDataRow => {
      if (!result[seriesDataRow.seriesid]) {
        result[seriesDataRow.seriesid] = [];
      }
      result[seriesDataRow.seriesid].push(seriesDataRow);
    }
  );
  return result;
}

const predicateNextDateForSeries = (seriesDate, seriesId) => {
  const differenceInDaysSetForSeriesId = getDifferenceBetweenEachRowInDataSet(seriesDate);
  const averageDaysDifference = getAverageDifferenceFromArray(differenceInDaysSetForSeriesId);
  const groupedDateLastDate = getDataSetLastIndexDate(seriesDate);
  const predicatedDateForSeriesId = addDays(groupedDateLastDate, averageDaysDifference);
  return {
    seriesid: seriesId,
    date: predicatedDateForSeriesId
  };
}

const makePredictions = seriesData => {
  let outputPredictions = [];
  const dataGroupedBySeriesId = groupDateWithSeriesId(seriesData);
  Object.keys(dataGroupedBySeriesId).forEach((seriesId) => {
    seriesPredication = (predicateNextDateForSeries(dataGroupedBySeriesId[seriesId], seriesId));
    outputPredictions.push(seriesPredication);
  });
  fs.writeFile("output.json", JSON.stringify(outputPredictions), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
  });
}

const main = () => {
  // Note that the below code is violating the principle of immutability but is used pragmatically 
  // for interaction with the csv-parser library.  Mutating an object should generally be avoided.
  const seriesData = []
  fs.createReadStream("dates.csv")
    .pipe(csv())
    .on("data", data => seriesData.push(data))
    .on("end", () => {
      makePredictions(seriesData);
    });
}

main()
