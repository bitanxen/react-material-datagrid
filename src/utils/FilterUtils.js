export const isFilterPassed = (data, filters, dataType) => {
  if (filters.length === 0) {
    return true
  }

  const filterResult = filters
    .map((f) => {
      switch (dataType) {
        case 'string': {
          return {
            condition: f.conditionOperator,
            result: checkStringFilter(data, f)
          }
        }
        case 'number': {
          return {
            condition: f.conditionOperator,
            result: checkNumericFilter(data, f)
          }
        }
        case 'boolean': {
          return {
            condition: f.conditionOperator,
            result: checkBooleanFilter(data, f)
          }
        }
        case 'date': {
          return {
            condition: f.conditionOperator,
            result: checkDateFilter(data, f)
          }
        }
        case 'datetime': {
          return {
            condition: f.conditionOperator,
            result: checkDatetimeFilter(data, f)
          }
        }
        default: {
          return null
        }
      }
    })
    .filter((f) => f !== null)

  const andCondition = filterResult
    .filter((fr) => fr.condition === 'AND')
    .every((fr) => fr.result === true)

  const orConditionArr = filterResult.filter((fr) => fr.condition === 'OR')

  if (orConditionArr.length > 0) {
    const orCondition = orConditionArr.every((fr) => fr.result === true)

    if (orCondition) {
      return true
    }
  }

  return andCondition
}

const checkStringFilter = (data, f) => {
  const actualValue = data ? data.toLowerCase() : ''
  const targetValue = f.filterValue ? f.filterValue.toLowerCase() : ''
  switch (f.operator) {
    case 'Equals': {
      return actualValue === targetValue
    }
    case 'Not Equals': {
      return actualValue !== targetValue
    }
    case 'Contains': {
      return actualValue.includes(targetValue)
    }
    case 'Starts With': {
      return actualValue.startsWith(targetValue)
    }
    case 'Ends With': {
      return actualValue.endsWith(targetValue)
    }
    default: {
      return false
    }
  }
}

const checkNumericFilter = (data, f) => {
  const actualValue = !isNaN(parseFloat(data)) ? parseFloat(data) : 0
  const targetValue = !isNaN(parseFloat(f.filterValue))
    ? parseFloat(f.filterValue)
    : 0
  switch (f.operator) {
    case '=': {
      return actualValue === targetValue
    }
    case '!=': {
      return actualValue !== targetValue
    }
    case '>': {
      return actualValue > targetValue
    }
    case '<': {
      return actualValue < targetValue
    }
    case '>=': {
      return actualValue >= targetValue
    }
    case '<=': {
      return actualValue <= targetValue
    }
    default: {
      return false
    }
  }
}

const checkBooleanFilter = (data, f) => {
  if (f.filterValue === 'YES') {
    return Boolean(data)
  } else {
    return !data
  }
}

const checkDateFilter = (data, f) => {}

const checkDatetimeFilter = (data, f) => {}
