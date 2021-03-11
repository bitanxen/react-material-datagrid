import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  Typography,
  IconButton,
  Popover,
  MenuItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import clsx from 'clsx'
import _ from 'lodash'

import { getDefaultTools } from '../utils/ApplicationUtils'
import HeaderSettings from './HeaderSettings'

const useStyles = makeStyles((theme) => ({
  toolbarRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  smallSpacing: {
    padding: '0.7rem 0.5rem',
    fontSize: '1rem'
  },
  mediumSpacing: {
    padding: '0.8rem 0.8rem',
    fontSize: '1.2rem'
  },
  largeSpacing: {
    padding: '0.9rem 1rem',
    fontSize: '1.3rem'
  },
  tableInfo: {
    width: '60%'
  },
  tableInfoText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  tableToolInfo: {
    display: 'flex',
    justifyContent: 'justify-end',
    overflow: 'hidden'
  },
  menuItem: {
    fontSize: '0.8rem',
    minHeight: 0
  },
  menuIcon: {
    minWidth: '30px'
  },
  visibleMenuIcons: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    fontSize: 24
  },
  showSelectedData: {
    textDecoration: 'underline',
    color: theme.palette.secondary.main
  }
}))

function MaterialToolbar(props) {
  const classes = useStyles()
  const [tools, setTools] = useState([])
  const [toolMenu, setToolMenu] = useState(null)
  const [columnSetting, setColumnSetting] = useState(null)
  const {
    tableSize,
    tableName,
    tableWidth,
    searchable,
    filterable,
    downloadable,
    settingsProps,
    tableTools,
    toolIconColor,
    header,
    toggleShowHideColumn,
    columnReorderHandler,
    calculatedSelected,
    showSelectedData,
    showSelectedDataHandler
  } = props

  const openHiddenTools = (event) => {
    setToolMenu(event.currentTarget)
  }

  const startSearch = () => {}

  const startFilter = () => {}

  const startDownload = () => {}

  const startReset = (event) => {
    setColumnSetting(event.currentTarget)
  }

  const closeReset = () => {
    setColumnSetting(null)
  }

  useEffect(() => {
    const defaultTools = getDefaultTools(
      searchable,
      startSearch,
      filterable,
      startFilter,
      downloadable,
      startDownload,
      settingsProps.resetColumn,
      startReset
    )
    const allTools = [...tableTools, ...defaultTools]

    let visibleTool = 0
    if (tableWidth >= 1600) {
      visibleTool = 10
    } else if (tableWidth >= 1200) {
      visibleTool = 8
    } else if (tableWidth >= 768) {
      visibleTool = 5
    } else if (tableWidth >= 600) {
      visibleTool = 3
    } else if (tableWidth >= 400) {
      visibleTool = 2
    }

    const toolsVisiable = _.slice(allTools, 0, visibleTool).map((t) => {
      return {
        ...t,
        show: true
      }
    })
    const toolsHidden = _.slice(allTools, visibleTool).map((t) => {
      return {
        ...t,
        show: false
      }
    })
    setTools([...toolsVisiable, ...toolsHidden])
  }, [
    searchable,
    filterable,
    downloadable,
    settingsProps.resetColumn,
    tableWidth,
    tableTools
  ])

  return (
    <div
      className={clsx(
        classes.toolbarRoot,
        tableSize === 'small'
          ? classes.smallSpacing
          : tableSize === 'medium'
          ? classes.mediumSpacing
          : classes.largeSpacing
      )}
    >
      <div className={classes.tableInfo}>
        <Typography className={classes.tableInfoText} variant="h5">
          {tableName}{' '}
          {calculatedSelected && calculatedSelected.length > 0 && (
            <>
              {' : '}
              <span
                onClick={() => showSelectedDataHandler(!showSelectedData)}
                style={{ cursor: 'pointer' }}
                className={showSelectedData ? classes.showSelectedData : ''}
              >
                {calculatedSelected.length} selected
              </span>
            </>
          )}
        </Typography>
      </div>
      <div className={classes.tableToolInfo}>
        {tools
          .filter((t) => t.show)
          .map((tool, index) => (
            <IconButton
              color={toolIconColor}
              key={index}
              aria-label={tool.name}
              size={tableSize === 'small' ? tableSize : 'medium'}
              className={classes.visibleMenuIcons}
              onClick={(e) => tool.clickHandler(e, calculatedSelected)}
            >
              <tool.icon fontSize="inherit" />
            </IconButton>
          ))}

        {tools.filter((t) => !t.show).length > 0 && (
          <div>
            <IconButton
              color={toolIconColor}
              aria-label="More"
              size={tableSize === 'small' ? tableSize : 'medium'}
              onClick={openHiddenTools}
              className={classes.visibleMenuIcons}
            >
              <MoreVert fontSize="inherit" />
            </IconButton>
            <Popover
              open={Boolean(toolMenu)}
              anchorEl={toolMenu}
              onClose={() => setToolMenu(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              {tools
                .filter((t) => !t.show)
                .map((tool, index) => (
                  <React.Fragment key={index}>
                    <MenuItem
                      onClick={(e) => {
                        tool.clickHandler(e, calculatedSelected)
                        setToolMenu(null)
                      }}
                      className={classes.menuItem}
                    >
                      <ListItemIcon
                        color={toolIconColor}
                        className={classes.menuIcon}
                      >
                        <tool.icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        className="pl-0"
                        primary={tool.name}
                      />
                    </MenuItem>
                  </React.Fragment>
                ))}
            </Popover>
          </div>
        )}
        <HeaderSettings
          tool={columnSetting}
          closeTools={closeReset}
          header={header}
          toggleShowHideColumn={toggleShowHideColumn}
          columnReorderHandler={columnReorderHandler}
        />
      </div>
    </div>
  )
}

MaterialToolbar.defaultProps = {
  settingsProps: {
    resetColumn: true,
    resizeColumn: true,
    freezeColumm: true,
    columnRepositioning: true,
    ordering: true
  },
  tableTools: []
}

MaterialToolbar.propTypes = {
  tableName: PropTypes.string.isRequired,
  tableSize: PropTypes.string.isRequired,
  tableWidth: PropTypes.number.isRequired,
  searchable: PropTypes.bool.isRequired,
  filterable: PropTypes.bool.isRequired,
  downloadable: PropTypes.bool.isRequired,
  settingsProp: PropTypes.shape({
    resetColumn: PropTypes.bool,
    resizeColumn: PropTypes.bool,
    freezeColumm: PropTypes.bool,
    columnRepositioning: PropTypes.bool,
    ordering: PropTypes.bool
  }),
  tableTools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired,
      clickHandler: PropTypes.func.isRequired,
      display: PropTypes.bool
    })
  ),
  toolIconColor: PropTypes.string.isRequired,
  searchHandler: PropTypes.func.isRequired,
  filterhandler: PropTypes.func.isRequired,
  downloadHandler: PropTypes.func.isRequired,
  sorting: PropTypes.object,
  header: PropTypes.array.isRequired,
  toggleShowHideColumn: PropTypes.func.isRequired,
  columnReorderHandler: PropTypes.func.isRequired,
  calculatedSelected: PropTypes.any,
  showSelectedData: PropTypes.bool.isRequired,
  showSelectedDataHandler: PropTypes.func.isRequired
}

export default MaterialToolbar
