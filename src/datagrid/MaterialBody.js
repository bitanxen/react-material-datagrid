import React from 'react'
import PropTypes from 'prop-types'
import {
  useTheme,
  makeStyles,
  Typography,
  Avatar,
  Checkbox
} from '@material-ui/core'

import { stableSort, getSorting } from '../utils/ApplicationUtils'

const useStyles = makeStyles((theme) => ({
  bodyWrapper: {
    width: 'auto'
  },
  bodyRow: {
    display: 'flex',
    height: '40px'
  },
  bodyCell: {
    borderBottom: '0.5px solid #D3D5D9',
    padding: '0px 10px',
    display: 'flex',
    alignItems: 'center',
    maxHeight: '100%'
  },
  avater: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  },
  cellValue: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

function MaterialBody(props) {
  const classes = useStyles()
  const theme = useTheme()
  const {
    freezeSection,
    freezeColumnWidth,
    header,
    data,
    sorting,
    calculatedSelected,
    calculatedKeyCol,
    singleRowSelectionHandler,
    dataSelectionHandler,
    page,
    rowsPerPage
  } = props

  const isSelected = (row) => {
    const isSelectedArray =
      calculatedSelected && calculatedSelected.length > 0
        ? calculatedSelected.filter(
            (d) => d[calculatedKeyCol] === row[calculatedKeyCol]
          )
        : []
    return isSelectedArray.length > 0
  }

  return (
    <div className={classes.bodyWrapper}>
      {stableSort(data, getSorting(sorting))
        .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
        .map((row, index) => (
          <React.Fragment key={index}>
            <div className={classes.bodyRow}>
              {((freezeSection && freezeColumnWidth > 0) ||
                (!freezeSection && freezeColumnWidth === 0)) &&
                (dataSelectionHandler || calculatedSelected) && (
                  <div className={classes.bodyCell}>
                    <Checkbox
                      style={{ padding: 0 }}
                      checked={isSelected(row)}
                      onChange={() => singleRowSelectionHandler(row)}
                      disabled={!dataSelectionHandler}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </div>
                )}
              {header
                .filter((h) => h.display)
                .filter((h) => h.freeze === freezeSection)
                .map((h) => (
                  <div
                    className={classes.bodyCell}
                    style={{
                      minWidth: h.targetWidth,
                      width: h.targetWidth,
                      backgroundColor: h.backgroundColor
                        ? typeof h.backgroundColor === 'function'
                          ? h.backgroundColor(row)
                          : h.backgroundColor
                        : 'transparent',
                      color: theme.palette.getContrastText(
                        h.backgroundColor
                          ? typeof h.backgroundColor === 'function'
                            ? h.backgroundColor(row)
                            : h.backgroundColor
                          : '#FFFFFF'
                      )
                    }}
                    key={h.colId}
                  >
                    {(h.avaterText || h.avaterSrc) && (
                      <div style={{ marginRight: '10px' }}>
                        <Avatar
                          alt={h.avaterText || ''}
                          src={row[`${h.colId}Avater`]}
                          className={classes.avater}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ margin: 'auto 0', width: '100%' }}>
                        <Typography
                          className={classes.cellValue}
                          variant="body2"
                        >
                          {row[h.colId]}
                        </Typography>
                      </div>
                      {h.icon && (
                        <div>
                          {typeof h.icon === 'function' ? (
                            <>{h.icon(row)}</>
                          ) : React.isValidElement(h.icon) ? (
                            <>{h.icon}</>
                          ) : (
                            <h.icon />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </React.Fragment>
        ))}
    </div>
  )
}

MaterialBody.propTypes = {
  tableSize: PropTypes.string.isRequired,
  freezeSection: PropTypes.bool.isRequired,
  freezeColumnWidth: PropTypes.number.isRequired,
  header: PropTypes.array.isRequired,
  data: PropTypes.array,
  sorting: PropTypes.object,
  calculatedSelected: PropTypes.any,
  calculatedKeyCol: PropTypes.string,
  singleRowSelectionHandler: PropTypes.func.isRequired,
  dataSelectionHandler: PropTypes.func
}

export default React.memo(MaterialBody)
