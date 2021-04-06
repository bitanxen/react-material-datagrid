import { Settings, Search, FilterList } from '@material-ui/icons'
import { createMuiTheme } from '@material-ui/core'
import { purple, green } from '@material-ui/core/colors'
import { isFilterPassed } from './FilterUtils'

export const breakpointQuery = (width, query) => {
  switch (query) {
    case 'xs': {
      if (width >= 0) {
        return true
      }
      break
    }
    case 'sm': {
      if (width >= 600) {
        return true
      }
      break
    }
    case 'md': {
      if (width >= 768) {
        return true
      }
      break
    }
    case 'lg': {
      if (width >= 1200) {
        return true
      }
      break
    }
    default: {
      break
    }
  }
  return false
}

export const getDefaultTools = (
  isSearchable,
  searchHandler,
  isFilterable,
  filterHandler,
  isDownloadable,
  downloadhandler,
  settingsEnable,
  settingsHandler
) => {
  return [
    {
      name: 'Search',
      icon: Search,
      clickHandler: searchHandler,
      display: isSearchable
    },
    {
      name: 'Filter',
      icon: FilterList,
      clickHandler: filterHandler,
      display: isFilterable
    },
    /*
    {
      name: 'Download',
      icon: CloudDownload,
      clickHandler: downloadhandler,
      display: isDownloadable
    },
    */
    {
      name: 'Settings',
      icon: Settings,
      clickHandler: settingsHandler,
      display: settingsEnable
    }
  ]
}

export const newMuiTheme = () => {
  return createMuiTheme({
    palette: {
      primary: {
        main: purple[500]
      },
      secondary: {
        main: green[500]
      }
    }
  })
}

export function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}
export const stableSort = (data, cmp) => {
  if (!cmp) {
    return data
  }
  const stabilizedThis = data.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export const getSorting = (sorting) => {
  if (!sorting) {
    return null
  }
  return sorting.order === 'desc'
    ? (a, b) => desc(a, b, sorting.property)
    : (a, b) => -desc(a, b, sorting.property)
}

export const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}

export const isSortable = (header) => {
  return true
}

export const filterData = (data, filterCriteria, header) => {
  let filteredData = []
  if (filterCriteria.searchTerm && filterCriteria.searchTerm.length > 0) {
    filteredData = data.filter((row) => {
      for (const property in row) {
        if (isIdCol(header, property)) continue
        if (row[property] === undefined) continue
        if (isNonSearchableColumn(header, property)) continue
        if (
          row[property]
            .toString()
            .toLowerCase()
            .includes(filterCriteria.searchTerm.toLowerCase())
        ) {
          return true
        }
      }
      return false
    })
  } else {
    filteredData = data
  }

  if (filterCriteria.filters) {
    const filterColumns = Object.keys(filterCriteria.filters)
    filteredData = filteredData.filter((row) => {
      for (const property in row) {
        const targetColumnArr = filterColumns.filter((f) => f === property)

        if (targetColumnArr.length === 0) {
          continue
        } else {
          return applyFilter(
            row[property],
            filterCriteria.filters[property],
            header,
            property
          )
        }
      }
      return false
    })
  }

  return filteredData
}

const applyFilter = (actualData, filters, header, colId) => {
  const col = header.filter((f) => f.colId === colId)[0]
  return isFilterPassed(actualData, filters, col.dataType)
}

const isIdCol = (header, colId) => {
  const headerCol = header.filter((h) => h.colId === colId)
  if (headerCol.length === 0) {
    return false
  } else {
    return headerCol[0].isIdCol === true
  }
}

export const isNonSearchableColumn = (header, colId) => {
  const hArr = header.filter((h) => h.colId === colId)
  if (hArr.length === 0) {
    return true
  }
  const dataType = hArr[0].dataType

  return (
    dataType !== 'string' &&
    dataType !== 'number' &&
    dataType !== 'boolean' &&
    dataType !== 'date' &&
    dataType !== 'datetime'
  )
}

export const getOperatorOptions = (header) => {
  switch (header.dataType) {
    case 'string': {
      return ['Equals', 'Not Equals', 'Contains', 'Starts With', 'Ends With']
    }
    case 'number': {
      return ['=', '!=', '>', '<', '>=', '<=']
    }
    case 'boolean': {
      return ['Equal']
    }
    case 'date': {
      return [
        'Equals',
        'Not Equals',
        'Before',
        'After',
        'Equal or Before',
        'Equal or After'
      ]
    }
  }
}
