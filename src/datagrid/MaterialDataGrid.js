import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  createGenerateClassName,
  StylesProvider,
  Paper,
  ThemeProvider,
  Divider
} from '@material-ui/core'

import useWidth from '../hooks/useWidth'
import { breakpointQuery, newMuiTheme } from '../utils/ApplicationUtils'
import MaterialToolbar from './MaterialToolbar'
import MaterialHeader from './MaterialHeader'

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    display: 'flex'
  },
  tableFreezeSection: {
    overflow: 'auto'
  }
}))

function MaterialDataGrid(props) {
  const containerRef = useRef(null)
  const classes = useStyles()
  const width = useWidth(containerRef)
  const [calculatedSize, setCaluclatedSize] = useState('medium')
  const [calculatedHeader, setCalculatedHeader] = useState([])

  const {
    theme,
    tableName,
    header,
    fitColumns,
    data,
    tableSize,
    searchable,
    filterable,
    downloadable,
    settingsProps,
    tableTools,
    toolIconColor
  } = props

  useEffect(() => {
    if (tableSize) {
      setCaluclatedSize(tableSize)
    } else {
      const isMD = breakpointQuery(width, 'md')
      const isLG = breakpointQuery(width, 'lg')

      if (isLG) {
        setCaluclatedSize('large')
      } else if (!isLG && isMD) {
        setCaluclatedSize('medium')
      } else {
        setCaluclatedSize('small')
      }
    }
  }, [tableSize, width])

  const refitColumns = useCallback(() => {
    if (fitColumns) {
      const totalColumnWidth = calculatedHeader
        .filter((h) => h.display)
        .map((h) => h.targetWidth)
        .reduce((t, n) => t + n, 0)

      const fitCompletedArray = calculatedHeader.filter((h) => h.fitDone)
      if (
        fitCompletedArray.length === 0 &&
        totalColumnWidth > 0 &&
        totalColumnWidth < width
      ) {
        const poportion =
          (width - totalColumnWidth) / calculatedHeader.length - 2

        setCalculatedHeader(
          calculatedHeader
            .filter((h) => h.display)
            .map((h) => {
              h.minWidth = h.minWidth + poportion
              h.targetWidth = h.targetWidth + poportion
              h.maxWidth = h.maxWidth + poportion
              h.fitDone = true
              return h
            })
        )
      }
    }
  }, [width, fitColumns, calculatedHeader])

  useEffect(() => {
    setCalculatedHeader(
      header.map((h) => {
        h.width = h.width ? h.width : 100
        h.minWidth = h.width + 125
        h.targetWidth = h.width + 125
        h.maxWidth = h.maxWidth + 125
        h.freeze = h.freeze || false
        return h
      })
    )
  }, [header])

  useEffect(() => {
    refitColumns()
  }, [refitColumns])

  const resizeHandler = (header, event, resize) => {
    if (resize.size.width >= header.width + 125) {
      header.targetWidth = resize.size.width
      header.minWidth = resize.size.width

      setCalculatedHeader(
        calculatedHeader.map((h) => {
          if (h.colId === header.colId) {
            return header
          } else {
            return h
          }
        })
      )
    }
  }

  const freezeColumnHandler = (colId) => {
    setCalculatedHeader(
      calculatedHeader.map((h) => {
        if (h.colId === colId) {
          h.freeze = !h.freeze
        }
        return h
      })
    )
    refitColumns()
  }

  const toggleShowHideColumn = (colId) => {
    console.log(colId)
    setCalculatedHeader(
      calculatedHeader.map((h) => {
        if (h.colId === colId) {
          h.display = !h.display
        }
        h.fitDone = false
        return h
      })
    )
  }

  const getFreezeColWidth = () => {
    const freezeWidth = calculatedHeader
      .filter((h) => h.freeze)
      .map((h) => h.targetWidth)
      .reduce((t, n) => t + n, 0)
    if (freezeWidth === 0) {
      return freezeWidth
    }

    const regularWidth = calculatedHeader
      .filter((h) => !h.freeze)
      .map((h) => h.targetWidth)
      .reduce((t, n) => t + n, 0)

    const maxLimit = (width * 60) / 100
    const remaining = width - maxLimit

    if (freezeWidth > maxLimit) {
      if (regularWidth > remaining) {
        return maxLimit
      } else {
        return freezeWidth
      }
    } else {
      return freezeWidth
    }
  }

  const getRegularColWidth = () => {
    const freezeWidth = getFreezeColWidth()
    return width - freezeWidth
  }

  return (
    <StylesProvider generateClassName={createGenerateClassName()}>
      <ThemeProvider theme={theme || newMuiTheme()}>
        <div ref={containerRef}>
          <Paper>
            <MaterialToolbar
              tableName={tableName}
              tableSize={calculatedSize}
              tableWidth={width || 1000}
              searchable={searchable}
              filterable={filterable}
              downloadable={downloadable}
              settingsProps={settingsProps}
              tableTools={tableTools}
              toolIconColor={toolIconColor}
              searchHandler={() => {}}
              filterhandler={() => {}}
              downloadHandler={() => {}}
              resetColumnHandler={() => {}}
            />
            <div className={classes.tableWrapper} style={{ width: width }}>
              <div
                className={classes.tableFreezeSection}
                style={{ width: getFreezeColWidth() }}
              >
                <MaterialHeader
                  tableSize={calculatedSize}
                  header={calculatedHeader}
                  resizeHandler={resizeHandler}
                  freezeColumnHandler={freezeColumnHandler}
                  freezeSection={true}
                  toggleShowHideColumn={toggleShowHideColumn}
                />
                <Divider />
              </div>
              <div
                style={{
                  width: getRegularColWidth(),
                  overflow: 'auto',
                  padding: '0 0 0 5px'
                }}
              >
                <MaterialHeader
                  tableSize={calculatedSize}
                  header={calculatedHeader}
                  resizeHandler={resizeHandler}
                  freezeColumnHandler={freezeColumnHandler}
                  freezeSection={false}
                  toggleShowHideColumn={toggleShowHideColumn}
                />
                <Divider />
              </div>
            </div>
            hi
            <div>hello</div>
          </Paper>
          Width: {width}
          <br />
          Breakpoint: {calculatedSize}
          <br />
        </div>
      </ThemeProvider>
    </StylesProvider>
  )
}

MaterialDataGrid.defaultProps = {
  fitColumns: false,
  searchable: true,
  filterable: true,
  downloadable: true,
  settingsProps: {
    resetColumn: true,
    resizeColumn: true,
    freezeColumm: true,
    columnRepositioning: true,
    ordering: true
  },
  tableTools: [],
  toolIconColor: 'primary'
}

MaterialDataGrid.propTypes = {
  theme: PropTypes.object,
  tableName: PropTypes.string.isRequired,
  tableSize: PropTypes.oneOf(['small', 'medium', 'large', undefined]),
  header: PropTypes.arrayOf(
    PropTypes.shape({
      isIdCol: PropTypes.bool,
      colId: PropTypes.string.isRequired,
      colName: PropTypes.string.isRequired,
      dataValue: PropTypes.func,
      dataType: PropTypes.oneOf([
        'string',
        'number',
        'boolean',
        'date',
        'datetime',
        'icon',
        'button',
        'avater'
      ]),
      backgroundColor: PropTypes.string,
      buttonVariant: PropTypes.oneOf(['contained', 'outlined', 'text']),
      buttonColor: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary'
      ]),
      icon: PropTypes.node,
      avaterText: PropTypes.string,
      avaterSrc: PropTypes.string,
      freeze: PropTypes.bool,
      display: PropTypes.bool,
      resize: PropTypes.bool,
      width: PropTypes.number,
      maxWidth: PropTypes.number
    })
  ).isRequired,
  fitColumns: PropTypes.bool,
  data: PropTypes.array,
  searchable: PropTypes.bool,
  filterable: PropTypes.bool,
  downloadable: PropTypes.bool,
  settingsProps: PropTypes.shape({
    resetColumn: PropTypes.bool,
    resizeColumn: PropTypes.bool,
    freezeColumm: PropTypes.bool,
    columnRepositioning: PropTypes.bool,
    ordering: PropTypes.bool
  }),
  tableTools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      clickHandler: PropTypes.func.isRequired,
      display: PropTypes.bool
    })
  ),
  toolIconColor: PropTypes.oneOf([
    'default',
    'inherit',
    'primary',
    'secondary'
  ]),
  dataSelected: PropTypes.array,
  dataSelectionHandler: PropTypes.func
}

export default MaterialDataGrid
