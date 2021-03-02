import React, { useState } from 'react'
import {
  makeStyles,
  Typography,
  IconButton,
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core'
import {
  MoreVert,
  Lock,
  FilterList,
  ArrowDownwardSharp,
  ArrowUpwardSharp,
  VisibilityOff
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Resizable } from 'react-resizable'

const useStyles = makeStyles((theme) => ({
  headerRoot: {
    display: 'flex',
    alignItems: 'center'
  },
  smallSpacing: {
    padding: '0.2rem 0',
    fontSize: '0.7rem',
    height: 30
  },
  mediumSpacing: {
    padding: '0.25rem 0',
    fontSize: '0.8rem',
    height: 35
  },
  largeSpacing: {
    padding: '0.3rem 0',
    fontSize: '1rem',
    height: 40
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
    opacity: '0.9'
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
  }
}))

function MaterialHeader(props) {
  const classes = useStyles()
  const [headerTools, setHeaderTools] = useState({
    target: null,
    header: null
  })
  const {
    tableSize,
    header,
    resizeHandler,
    freezeColumnHandler,
    freezeSection,
    toggleShowHideColumn,
    sorting,
    sortColumn
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
      {header
        .filter((h) => h.display)
        .filter((h) => h.freeze === freezeSection)
        .map((h, index) => (
          <Resizable
            key={index}
            className={classes.headerCells}
            width={h.targetWidth}
            style={{ minWidth: h.minWidth, width: h.targetWidth }}
            height={40}
            maxConstraints={h.maxWidth ? [h.maxWidth, 40] : undefined}
            resizeHandles={['e']}
            handle={h.resize && <span className={classes.verticalLine} />}
            handleSize={[15, 15]}
            onResize={(e, resize) => resizeHandler(h, e, resize)}
          >
            <div className={classes.headerCell}>
              <div
                style={{ display: 'flex', cursor: 'pointer' }}
                onClick={() => sortColumn(h)}
              >
                <div
                  className={classes.headerCellInfo}
                  style={{ width: h.targetWidth - 120 }}
                >
                  <Typography className={classes.headerText} variant="body2">
                    {h.colName}
                  </Typography>
                </div>

                <div className={classes.headerOrder}>
                  {sorting && sorting.property === h.colId && (
                    <>
                      {sorting.order === 'desc' ? (
                        <ArrowDownwardSharp fontSize="small" />
                      ) : (
                        <ArrowUpwardSharp fontSize="small" />
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={clsx(classes.headerTools, classes.hoverShow)}>
                <IconButton
                  aria-label="Column Freezed"
                  size="small"
                  className={
                    !h.freeze ? classes.defaultHide : classes.defaultShow
                  }
                  onClick={() => freezeColumnHandler(h.colId)}
                >
                  <Lock fontSize="inherit" />
                </IconButton>
                <IconButton
                  aria-label="Column Filtered"
                  size="small"
                  className={classes.defaultHide}
                >
                  <FilterList fontSize="inherit" />
                </IconButton>
                <IconButton
                  aria-label="Column Settings"
                  size="small"
                  onClick={(e) => openHeaderTool(e, h)}
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
        <MenuItem
          onClick={() => {
            if (headerTools && headerTools.header) {
              sortColumn(headerTools.header)
            }
            closeHeaderTool()
          }}
          className={classes.menuItem}
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
        >
          <ListItemIcon className={classes.menuIcon}>
            <ArrowDownwardSharp fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography primary="Order DESC" />
        </MenuItem>
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
    </div>
  )
}

MaterialHeader.propTypes = {
  tableSize: PropTypes.string.isRequired,
  resizeHandler: PropTypes.func.isRequired,
  header: PropTypes.array.isRequired,
  freezeColumnHandler: PropTypes.func.isRequired,
  freezeSection: PropTypes.bool.isRequired,
  toggleShowHideColumn: PropTypes.func.isRequired,
  sorting: PropTypes.object,
  sortColumn: PropTypes.func.isRequired
}
export default MaterialHeader
