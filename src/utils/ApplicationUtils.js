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
