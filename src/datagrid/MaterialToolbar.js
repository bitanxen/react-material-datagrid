import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  withStyles,
  Badge,
  Typography,
  IconButton,
  Popover,
  MenuItem,
  ListItemText,
  ListItemIcon,
  ClickAwayListener,
  InputBase
} from '@material-ui/core'
import { MoreVert, CloseSharp } from '@material-ui/icons'
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
    width: '60%',
    display: 'flex'
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
    marginRight: theme.spacing(0.5)
  },
  showSelectedData: {
    textDecoration: 'underline',
    color: theme.palette.secondary.main
  }
}))

function MaterialToolbar(props) {
  const classes = useStyles()
  const textInput = useRef(null)
  const [tools, setTools] = useState([])
  const [toolMenu, setToolMenu] = useState(null)
  const [columnSetting, setColumnSetting] = useState(null)
  const [searchEnable, setSearchEnable] = useState(false)
  const {
    tableSize,
    tableName,
    tableWidth,
    settingsProps,
    tableTools,
    toolIconColor,
    header,
    toggleShowHideColumn,
    columnReorderHandler,
    calculatedSelected,
    showSelectedData,
    showSelectedDataHandler,
    updateSearchTerm,
    viewFiltershandler
  } = props

  const openHiddenTools = (event) => {
    setToolMenu(event.currentTarget)
  }

  const startSearch = () => {
    setSearchEnable(true)
  }

  const startFilter = useCallback(() => {
    viewFiltershandler(true)
  }, [viewFiltershandler])

  const startDownload = () => {}

  const startReset = (event) => {
    setColumnSetting(event.currentTarget)
  }

  const closeReset = () => {
    setColumnSetting(null)
  }

  useEffect(() => {
    if (searchEnable && textInput.current) {
      textInput.current.focus()
    }
  }, [searchEnable, textInput])

  const handleClickAway = () => {
    if (textInput.current.value.length === 0) {
      setSearchEnable(false)
    }
  }

  useEffect(() => {
    const defaultTools = getDefaultTools(
      settingsProps.searchable,
      startSearch,
      settingsProps.filterable,
      startFilter,
      settingsProps.downloadable,
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
    settingsProps.searchable,
    settingsProps.filterable,
    settingsProps.downloadable,
    settingsProps.resetColumn,
    startFilter,
    tableWidth,
    tableTools
  ])

  const StyledBadge = withStyles((theme) => ({
    badge: {
      right: -12,
      top: 8,
      padding: '0 4px'
    }
  }))(Badge)

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
        <div
          style={{
            height: '100%',
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: '10px'
          }}
        >
          <StyledBadge
            style={{ cursor: 'pointer' }}
            badgeContent={calculatedSelected ? calculatedSelected.length : 0}
            color={showSelectedData ? 'secondary' : 'error'}
            onClick={() => {
              if (calculatedSelected && calculatedSelected.length > 0) {
                showSelectedDataHandler(!showSelectedData)
              }
            }}
          >
            <Typography className={classes.tableInfoText} variant="h6">
              {tableName}
            </Typography>
          </StyledBadge>
        </div>
        {searchEnable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '30px'
            }}
          >
            <IconButton
              onClick={() => {
                updateSearchTerm(null)
                setSearchEnable(false)
              }}
            >
              <CloseSharp style={{ color: 'red' }} />
            </IconButton>
            <div style={{ paddingLeft: '5px' }}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <InputBase
                  className={classes.textField}
                  placeholder={`Search ${tableName}`}
                  inputProps={{ 'aria-label': 'search table' }}
                  onChange={(e) => {
                    setTimeout(updateSearchTerm(e.target.value), 500)
                  }}
                  inputRef={textInput}
                />
              </ClickAwayListener>
            </div>
          </div>
        )}
      </div>
      <div className={classes.tableToolInfo}>
        {tools
          .filter((t) => t.show)
          .map((tool, index) => (
            <IconButton
              color={toolIconColor}
              size="medium"
              key={index}
              aria-label={tool.name}
              className={classes.visibleMenuIcons}
              onClick={(e) => tool.clickHandler(e, calculatedSelected)}
            >
              <tool.icon style={{ fontSize: '1.6rem' }} />
            </IconButton>
          ))}

        {tools.filter((t) => !t.show).length > 0 && (
          <div>
            <IconButton
              color={toolIconColor}
              aria-label="More"
              size="medium"
              onClick={openHiddenTools}
              className={classes.visibleMenuIcons}
            >
              <MoreVert style={{ fontSize: '1.6rem' }} />
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
                .filter((t) => t.display)
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
                        <tool.icon style={{ fontSize: '1.6rem' }} />
                      </ListItemIcon>
                      <ListItemText disableTypography primary={tool.name} />
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
  settingsProp: PropTypes.shape({
    searchable: PropTypes.bool.isRequired,
    filterable: PropTypes.bool.isRequired,
    downloadable: PropTypes.bool.isRequired,
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
