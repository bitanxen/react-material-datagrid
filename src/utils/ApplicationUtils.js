import { Search, FilterList, CloudDownload, Settings } from '@material-ui/icons'
import { createMuiTheme } from '@material-ui/core'
import { purple, green } from '@material-ui/core/colors'

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
    {
      name: 'Download',
      icon: CloudDownload,
      clickHandler: downloadhandler,
      display: isDownloadable
    },
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
