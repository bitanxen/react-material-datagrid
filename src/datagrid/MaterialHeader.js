import React, { useEffect, useState } from 'react'
import {
  makeStyles,
  Typography,
  IconButton,
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@material-ui/core'
import {
  MoreVert,
  Lock,
  FilterList,
  ArrowDownwardSharp,
  ArrowUpwardSharp,
  VisibilityOff,
  Clear
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Resizable } from 'react-resizable'
import { isSortable, isNonSearchableColumn } from '../utils/ApplicationUtils'
import HeaderFilter from './HeaderFilter'

const useStyles = makeStyles((theme) => ({
  headerRoot: {
    display: 'flex',
    alignItems: 'center'
  },
  smallSpacing: {
    fontSize: '0.7rem',
    height: 40
  },
  mediumSpacing: {
    fontSize: '0.8rem',
    height: 45
  },
  largeSpacing: {
    fontSize: '1rem',
    height: 50
  },
  headerCells: {
    padding: '0 0.5rem',
    height: '100%'
  },
  headerCell: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
    borderBottom: '0.5px solid #878C97'
  },
  headerCellInfo: {
    margin: 'auto 0'
  },
  headerText: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  headerOrder: {
    width: '25px',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  headerTools: {
    width: '100px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  verticalLine: {
    borderRight: '2px solid #8FA3A2',
    height: '80%',
    margin: 'auto 0',
    cursor: 'w-resize',
    width: 5
  },
  defaultHide: {
    opacity: '0'
  },
  defaultShow: {
    display: 'block',
    opacity: '0.9',
    color: theme.palette.secondary.dark
  },
  hoverShow: {
    '&:hover': {
      '& $defaultHide': {
        display: 'block',
        opacity: '1'
      }
    }
  },
  menuItem: {
    fontSize: '0.8rem',
    minHeight: 0
  },
  menuIcon: {
    minWidth: '30px'
  },
  menuIconDisplay: {
    height: '30px',
    margin: 'auto'
  }
}))

function MaterialHeader(props) {
  const classes = useStyles()
  const [headerTools, setHeaderTools] = useState({
    target: null,
    header: null
  })
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [headerFilter, setHeaderFilter] = useState({
    target: null,
    header: null
  })
  const {
    tableSize,
    header,
    data,
    settingsProps,
    resizeHandler,
    freezeColumnHandler,
    freezeSection,
    freezeColumnWidth,
    toggleShowHideColumn,
    sorting,
    sortColumn,
    unsortColumn,
    allRowSelectionHandler,
    dataSelectionHandler,
    calculatedSelected,
    selectionVariant,
    filterCriteria,
    createUpdateFilter,
    removeFilter
  } = props

  const closeHeaderTool = () => {
    setHeaderTools({
      target: null,
      header: null
    })
  }

  const openHeaderTool = (event, header) => {
    setHeaderTools({
      target: event.currentTarget,
      header: header
    })
  }

  const closeHeaderFilter = () => {
    setHeaderFilter({
      target: null,
      header: null
    })
  }

  const openHeaderFilter = (event, header) => {
    setHeaderFilter({
      target: event.currentTarget,
      header: header
    })
  }

  useEffect(() => {
    setChecked(
      calculatedSelected ? calculatedSelected.length === data.length : false
    )
  }, [calculatedSelected, data])

  useEffect(() => {
    setIndeterminate(
      calculatedSelected &&
        calculatedSelected.length > 0 &&
        calculatedSelected.length !== data.length
    )
  }, [calculatedSelected, data])

  const showFilter = (colId) => {
    return (
      (filterCriteria.filters &&
        filterCriteria.filters[colId] &&
        filterCriteria.filters[colId].length > 0) ||
      (headerFilter.header && headerFilter.header.colId === colId)
    )
  }

  return (
    <div
      className={clsx(
        classes.headerRoot,
        tableSize === 'small'
          ? classes.smallSpacing
          : tableSize === 'medium'
          ? classes.mediumSpacing
          : classes.largeSpacing
      )}
    >
      {((freezeSection && freezeColumnWidth > 0) ||
        (!freezeSection && freezeColumnWidth === 0)) &&
        (dataSelectionHandler || calculatedSelected) &&
        checked !== null && (
          <div className={classes.headerCell} style={{ minWidth: '45px' }}>
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              disabled={selectionVariant === 'single' || !dataSelectionHandler}
              onChange={() => allRowSelectionHandler()}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
        )}
      {header
        .filter((h) => h.display)
        .filter((h) => h.freeze === freezeSection)
        .map((h, index) => (
          <Resizable
            key={index}
            className={classes.headerCells}
            width={h.targetWidth}
            style={{
              minWidth: h.minWidth,
              width: h.targetWidth,
              transition: 'width 0.5s ease-in-out',
              position: 'relative'
            }}
            height={40}
            maxConstraints={h.maxWidth ? [h.maxWidth, 40] : undefined}
            resizeHandles={['e']}
            handle={
              ((settingsProps.resizeColumn && h.resize !== false) ||
                (!settingsProps.resizeColumn && h.resize)) && (
                <span className={classes.verticalLine} />
              )
            }
            handleSize={[15, 15]}
            onResize={(e, resize) => resizeHandler(h, e, resize)}
          >
            <div className={classes.headerCell}>
              <div
                style={{
                  display: 'flex',
                  textAlign:
                    h.dataType === 'number' ||
                    h.dataType === 'boolean' ||
                    h.dataType === 'button' ||
                    h.dataType === 'other'
                      ? 'center'
                      : 'left',
                  width: '100%'
                }}
              >
                <div
                  className={classes.headerCellInfo}
                  style={{ width: h.targetWidth }}
                >
                  <Typography className={classes.headerText} variant="body2">
                    {h.colName}
                  </Typography>
                </div>
              </div>
              <div
                className={clsx(classes.headerTools, classes.hoverShow)}
                style={{
                  position: 'absolute',
                  right: 0,
                  margin: 'auto 15px auto auto',
                  height: '100%'
                }}
              >
                {sorting && (
                  <IconButton
                    aria-label="Column Freezed"
                    size="small"
                    className={clsx(
                      classes.menuIconDisplay,
                      sorting.property === h.colId
                        ? classes.defaultShow
                        : classes.defaultHide
                    )}
                    disabled={!settingsProps.ordering}
                    onClick={() => {
                      if (isSortable(h)) {
                        sortColumn(h)
                      }
                    }}
                  >
                    {sorting.order === 'desc' ? (
                      <ArrowUpwardSharp fontSize="small" />
                    ) : (
                      <ArrowDownwardSharp fontSize="small" />
                    )}
                  </IconButton>
                )}
                {((settingsProps.freezeColumm && h.freezable !== false) ||
                  (!settingsProps.freezeColumm && h.freezable)) && (
                  <IconButton
                    aria-label="Column Freezed"
                    size="small"
                    className={clsx(
                      classes.menuIconDisplay,
                      !h.freeze ? classes.defaultHide : classes.defaultShow
                    )}
                    onClick={() => freezeColumnHandler(h.colId)}
                  >
                    <Lock fontSize="inherit" />
                  </IconButton>
                )}
                {settingsProps.filterable &&
                  !isNonSearchableColumn(header, h.colId) && (
                    <IconButton
                      aria-label="Column Filtered"
                      size="small"
                      className={clsx(
                        !showFilter(h.colId)
                          ? classes.defaultHide
                          : classes.defaultShow,
                        classes.menuIconDisplay
                      )}
                      onClick={(e) => openHeaderFilter(e, h)}
                    >
                      <FilterList fontSize="inherit" />
                    </IconButton>
                  )}
                <IconButton
                  aria-label="Column Settings"
                  size="small"
                  onClick={(e) => openHeaderTool(e, h)}
                  className={clsx(classes.menuIconDisplay)}
                >
                  <MoreVert fontSize="inherit" />
                </IconButton>
              </div>
            </div>
          </Resizable>
        ))}
      <Popover
        open={Boolean(headerTools.target)}
        anchorEl={headerTools.target}
        onClose={closeHeaderTool}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {headerTools &&
          headerTools.header &&
          settingsProps.ordering &&
          isSortable(headerTools.header) && (
            <>
              {sorting && (
                <MenuItem
                  onClick={() => {
                    unsortColumn()
                    closeHeaderTool()
                  }}
                  className={classes.menuItem}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <Clear fontSize="small" />
                  </ListItemIcon>
                  <ListItemText disableTypography primary="Unsort" />
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  if (headerTools && headerTools.header) {
                    sortColumn(headerTools.header)
                  }
                  closeHeaderTool()
                }}
                className={classes.menuItem}
                disabled={
                  headerTools &&
                  headerTools.header &&
                  sorting &&
                  sorting.order === 'desc' &&
                  headerTools.header.colId === sorting.property
                }
              >
                <ListItemIcon className={classes.menuIcon}>
                  <ArrowUpwardSharp fontSize="small" />
                </ListItemIcon>
                <ListItemText disableTypography primary="Order ASC" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (headerTools && headerTools.header) {
                    sortColumn(headerTools.header)
                  }
                  closeHeaderTool()
                }}
                className={classes.menuItem}
                disabled={
                  headerTools &&
                  headerTools.header &&
                  sorting &&
                  sorting.order === 'asc' &&
                  headerTools.header.colId === sorting.property
                }
              >
                <ListItemIcon className={classes.menuIcon}>
                  <ArrowDownwardSharp fontSize="small" />
                </ListItemIcon>
                <ListItemText disableTypography primary="Order DESC" />
              </MenuItem>
            </>
          )}
        <MenuItem
          onClick={() => {
            if (headerTools && headerTools.header) {
              toggleShowHideColumn(headerTools.header.colId)
            }
            closeHeaderTool()
          }}
          className={classes.menuItem}
        >
          <ListItemIcon className={classes.menuIcon}>
            <VisibilityOff fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography primary="Hide" />
        </MenuItem>
      </Popover>
      <HeaderFilter
        closeHandler={closeHeaderFilter}
        headerFilter={headerFilter}
        filterCriteria={filterCriteria}
        createUpdateFilter={createUpdateFilter}
        removeFilter={removeFilter}
      />
    </div>
  )
}

MaterialHeader.propTypes = {
  tableSize: PropTypes.string.isRequired,
  resizeHandler: PropTypes.func.isRequired,
  header: PropTypes.array.isRequired,
  data: PropTypes.array,
  freezeColumnHandler: PropTypes.func.isRequired,
  freezeSection: PropTypes.bool.isRequired,
  toggleShowHideColumn: PropTypes.func.isRequired,
  sorting: PropTypes.object,
  sortColumn: PropTypes.func.isRequired,
  unsortColumn: PropTypes.func.isRequired,
  freezeColumnWidth: PropTypes.number.isRequired,
  calculatedSelected: PropTypes.any,
  allRowSelectionHandler: PropTypes.func.isRequired,
  dataSelectionHandler: PropTypes.func,
  selectionVariant: PropTypes.string.isRequired
}
export default MaterialHeader
