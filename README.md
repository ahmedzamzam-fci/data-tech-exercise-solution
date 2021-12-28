# Date Prediction Coding Exercise

## Overview

Please find provided a CSV file containing observed dates for monthly direct debits and standing orders.

Each series of dates has its own series identifier and the date each transaction in the series was observed.

Your task is to predict the next date of the series taking into account the following:

- The simplest solution is preferred, even if it is not the most accurate. Although these two criteria, simplicity and accuracy, need to be balanced.
- No assessment of accuracy needs to be provided, a reasoned argument can be presented when answering the questions below.
- We program in a functional style and the use of RamdaJS is encouraged as we use the library extensively <https://ramdajs.com/docs/>. Some RamdaJS methods we commonly use are compose, groupBy, map, reduce, aperture and mapAccum amongst others. Sometimes we use a mix of functional and imperative style so do not feel the need to make everything functional, especially if it is at the expense of readability. However, consider immutability a key principle that should be upheld where possible, i.e. avoid reassigning identifiers or mutating objects.
- Results should be produced in CSV or JSON format.
- The exercise should take no more than an hour and reflects the day to day work conducted by the Data Team so hopefully should be fun.

## Questions

- Describe the method you used to predict the next date and why you chose it?
- What strategy would you use to implement a more accurate date prediction mechanism and what estimate would you give in terms of implementation effort required?
- How would you test the accuracy of date prediction?

## Answers 

- Method used is the folowing 
    - first i grouped the data based on series id
    - then looped over grouped data to predicate next date for each series 
    - by calculating the average difference betweeen each row in the data set for the series
    - then adding the average to last series date to get predicated date for the series

- Strategy that can be implemented to achieve better results is
    - getting the average for each date set like the current solution 
    - then adding the possibilty to compare similar average datasets and use the data from other data sets to predicate the next date
    - and i belive this solution can be more complex and would require more testing to make sure predictions are correct
- I would test the accuracy of date predication by taking the current real data and removing values and test if the prediction is close to the removed values 