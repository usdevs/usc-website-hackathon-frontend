export const getOnlyMonthAndYearFromDate = (dateToParse: Date) => {
  const month = dateToParse.getMonth()
  const year = dateToParse.getFullYear()
  return new Date(year, month)
}

export const getOnlyDayMonthAndYearFromDate = (dateToParse: Date) => {
  const dateWithMonthAndYear = getOnlyMonthAndYearFromDate(dateToParse)
  const date = dateToParse.getDate()
  dateWithMonthAndYear.setDate(date)
  return dateWithMonthAndYear
}
