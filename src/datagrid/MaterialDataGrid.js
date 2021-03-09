import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  createGenerateClassName,
  StylesProvider,
  Paper,
  ThemeProvider
} from '@material-ui/core'
import _ from 'lodash'

import useWidth from '../hooks/useWidth'
import { breakpointQuery, newMuiTheme } from '../utils/ApplicationUtils'
import MaterialToolbar from './MaterialToolbar'
import MaterialHeader from './MaterialHeader'
import MaterialBody from './MaterialBody'
import MaterialFooter from './MaterialFooter'

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    display: 'flex',
    overflow: 'hidden'
  },
  tableFreezeSection: {
    overflow: 'auto',
    boxShadow: '5px 0px 1px #DDD'
  }
}))

function MaterialDataGrid(props) {
  const containerRef = useRef(null)
  const freezeSectionRef = useRef(null)
  const regularSectionRef = useRef(null)
  const classes = useStyles()
  const width = useWidth(containerRef)
  const [calculatedSize, setCaluclatedSize] = useState('medium')
  const [calculatedHeader, setCalculatedHeader] = useState([])
  const [calculatedData, setCalculatedData] = useState([])
  const [calculatedSorting, setCalculatedSorting] = useState(null)
  const [calculatedSelected, setCalculatedSelected] = useState(null)
  const [calculatedKeyCol, setCalculatedKeyCol] = useState(null)
  const [calculatedPage, setCalculatedPage] = useState(1)
  const [rowPerPage, setRowPerPage] = useState(10)
  const [rowsOptions, setRowsOptions] = useState([])
  const [freezeSectionScroll, setFreezeSectionScroll] = useState(0)
  const [regularSectionScroll, setRegularSectionScroll] = useState(0)

  const {
    theme,
    className,
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
    toolIconColor,
    dataSelected,
    selectionVariant,
    dataSelectionHandler,
    pagination,
    rowsPerPageOptions,
    defaultRowsPerPage
  } = props

  useEffect(() => {
    setRowsOptions(rowsPerPageOptions)
    setRowPerPage(defaultRowsPerPage)
  }, [rowsPerPageOptions, defaultRowsPerPage])

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
        .map((h) => h.width + 125)
        .reduce((t, n) => t + n, 0)

      const fitCompletedArray = calculatedHeader.filter((h) => h.fitDone)
      if (
        fitCompletedArray.length === 0 &&
        totalColumnWidth > 0 &&
        totalColumnWidth < width
      ) {
        const visiableColumns = calculatedHeader.filter((h) => h.display)
        let checkBox = 0

        if (dataSelectionHandler || calculatedSelected) {
          checkBox = 45
        }

        const poportion =
          (width - totalColumnWidth - checkBox) / visiableColumns.length - 2

        setCalculatedHeader(
          calculatedHeader.map((h) => {
            if (h.display) {
              h.minWidth = h.width + 125 + poportion
              h.targetWidth = h.width + 125 + poportion
              h.maxWidth = h.maxWidth + 125 + poportion
              h.fitDone = true
            }
            return h
          })
        )
      }
    }
  }, [
    width,
    fitColumns,
    calculatedHeader,
    dataSelectionHandler,
    calculatedSelected
  ])

  useEffect(() => {
    const preparedHeader = header.map((h) => {
      h.width = h.width ? h.width : 100
      h.minWidth = h.width + 125
      h.targetWidth = h.width + 125
      h.maxWidth = h.maxWidth + 125
      h.freeze = h.freeze || false
      return h
    })

    const sortingArray = preparedHeader.filter((h) => h.sort)
    if (sortingArray.length > 0) {
      const sortingColumn = sortingArray[0]
      setCalculatedSorting({
        order: sortingColumn.sort,
        property: sortingColumn.colId
      })
    }

    const idColArray = preparedHeader.filter((h) => h.isIdCol)
    if (idColArray.length > 0) {
      setCalculatedKeyCol(idColArray[0].colId)
    }

    setCalculatedHeader(preparedHeader)
  }, [header])

  useEffect(() => {
    refitColumns()
  }, [refitColumns])

  const prepareData = useMemo(() => {
    const preparedData = data.map((d) => {
      const row = {}
      calculatedHeader.forEach((h) => {
        row[h.colId] = h.dataValue ? h.dataValue(d) : d[h.colId]
        if (h.avaterSrc) {
          row[`${h.colId}Avater`] = h.avaterSrc(d)
        }
      })
      return row
    })
    return preparedData || []
  }, [data, calculatedHeader])

  useEffect(() => {
    setCalculatedData(prepareData)
  }, [prepareData])

  useEffect(() => {
    if (calculatedData.length === 0) {
      return
    }
    if (!calculatedKeyCol) {
      return
    }
    if (calculatedSelected !== null) {
      return
    }

    const providedSelected = Array.isArray(dataSelected) ? dataSelected : []
    const selectedData = providedSelected
      .map((keyColValue) => {
        const foundSelectedData = calculatedData.filter(
          (calculatedUnSelectedData) => {
            return (
              '' + calculatedUnSelectedData[calculatedKeyCol] === keyColValue
            )
          }
        )
        return foundSelectedData.length === 0 ? false : foundSelectedData[0]
      })
      .filter((d) => d !== false)
    if (selectedData.length > 0) {
      if (selectionVariant === 'single') {
        setCalculatedSelected(selectedData[0])
      } else {
        setCalculatedSelected(selectedData)
      }
    } else if (dataSelected && Array.isArray(dataSelected)) {
      setCalculatedSelected([])
    }
  }, [
    dataSelected,
    calculatedData,
    calculatedKeyCol,
    calculatedSelected,
    selectionVariant
  ])

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

  const columnReorder = (result) => {
    if (!result) {
      return
    }
    const items = _.clone(calculatedHeader)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)
    setCalculatedHeader(items)
  }

  const singleRowSelectionHandler = (row) => {
    const isAlreadySelected =
      calculatedSelected && calculatedSelected.length > 0
        ? calculatedSelected.filter(
            (selectedRow) =>
              selectedRow[calculatedKeyCol] === row[calculatedKeyCol]
          )
        : []

    if (selectionVariant === 'single') {
      if (isAlreadySelected.length > 0) {
        setCalculatedSelected([])
        dataSelectionHandler([])
      } else {
        setCalculatedSelected([row])
        dataSelectionHandler([row])
      }
    } else {
      if (isAlreadySelected.length > 0) {
        const selected = calculatedSelected.filter(
          (selectedRow) =>
            selectedRow[calculatedKeyCol] !== row[calculatedKeyCol]
        )
        setCalculatedSelected(selected)
        dataSelectionHandler(selected)
      } else {
        const selected = [...calculatedSelected, row]
        setCalculatedSelected(selected)
        dataSelectionHandler(selected)
      }
    }
  }

  const allRowSelectionHandler = () => {
    if (calculatedSelected && calculatedSelected.length > 0) {
      setCalculatedSelected([])
      dataSelectionHandler([])
    } else {
      setCalculatedSelected(calculatedData)
      dataSelectionHandler(calculatedData)
    }
  }

  const getFreezeColWidth = () => {
    const freezeWidth = calculatedHeader
      .filter((h) => h.freeze)
      .filter((h) => h.display)
      .map((h) => h.targetWidth)
      .reduce((t, n) => t + n, 0)
    if (freezeWidth === 0) {
      return freezeWidth
    }

    const regularWidth = calculatedHeader
      .filter((h) => !h.freeze)
      .filter((h) => h.display)
      .map((h) => h.targetWidth)
      .reduce((t, n) => t + n, 0)

    const maxLimit = (width * 60) / 100
    const remaining = width - maxLimit

    if (freezeWidth > maxLimit) {
      if (regularWidth > remaining) {
        return maxLimit
      } else {
        return freezeWidth + 45
      }
    } else {
      return freezeWidth + 45
    }
  }

  const sortColumn = (h) => {
    const isDesc =
      calculatedSorting &&
      calculatedSorting.property === h.colId &&
      calculatedSorting.order === 'desc'
    if (isDesc) {
      setCalculatedSorting({
        order: 'asc',
        property: h.colId
      })
    } else {
      setCalculatedSorting({
        order: 'desc',
        property: h.colId
      })
    }
  }

  const unsortColumn = () => {
    setCalculatedSorting(null)
  }

  const getRegularColWidth = () => {
    const freezeWidth = getFreezeColWidth()
    return width - freezeWidth
  }

  const changePage = (page) => {
    setCalculatedPage(page)
  }

  const changeRowPerPage = (e) => {
    setCalculatedPage(1)
    setRowPerPage(e.target.value)
  }

  return (
    <StylesProvider generateClassName={createGenerateClassName()}>
      <ThemeProvider theme={theme || newMuiTheme()}>
        <div ref={containerRef} className={className}>
          <Paper style={{ backgroundColor: 'transparent' }}>
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
              sorting={calculatedSorting}
              header={calculatedHeader}
              toggleShowHideColumn={toggleShowHideColumn}
              columnReorderHandler={columnReorder}
              calculatedSelected={calculatedSelected}
            />
            <div
              className={classes.tableWrapper}
              style={{ width: `${width}px`, maxWidth: '100%' }}
            >
              <div
                className={classes.tableFreezeSection}
                style={{
                  width: getFreezeColWidth()
                }}
                ref={freezeSectionRef}
                onScroll={() => {
                  setFreezeSectionScroll(freezeSectionRef.current.scrollLeft)
                }}
              >
                <MaterialHeader
                  tableSize={calculatedSize}
                  header={calculatedHeader}
                  data={calculatedData}
                  resizeHandler={resizeHandler}
                  freezeColumnHandler={freezeColumnHandler}
                  freezeSection={true}
                  freezeColumnWidth={getFreezeColWidth()}
                  toggleShowHideColumn={toggleShowHideColumn}
                  sorting={calculatedSorting}
                  sortColumn={sortColumn}
                  unsortColumn={unsortColumn}
                  calculatedSelected={calculatedSelected}
                  allRowSelectionHandler={allRowSelectionHandler}
                  dataSelectionHandler={dataSelectionHandler}
                  selectionVariant={selectionVariant}
                  scrollLeft={freezeSectionScroll}
                />
                <MaterialBody
                  tableSize={calculatedSize}
                  freezeSection={true}
                  freezeColumnWidth={getFreezeColWidth()}
                  header={calculatedHeader}
                  data={calculatedData}
                  sorting={calculatedSorting}
                  calculatedSelected={calculatedSelected}
                  calculatedKeyCol={calculatedKeyCol}
                  singleRowSelectionHandler={singleRowSelectionHandler}
                  dataSelectionHandler={dataSelectionHandler}
                  selectionVariant={selectionVariant}
                  rowsPerPage={rowPerPage}
                  page={calculatedPage}
                />
              </div>
              <div
                style={{
                  width: getRegularColWidth(),
                  overflow: 'auto',
                  padding: '0 0 0 5px'
                }}
                ref={regularSectionRef}
                onScroll={() => {
                  setRegularSectionScroll(regularSectionRef.current.scrollLeft)
                }}
              >
                <MaterialHeader
                  tableSize={calculatedSize}
                  header={calculatedHeader}
                  data={calculatedData}
                  resizeHandler={resizeHandler}
                  freezeColumnHandler={freezeColumnHandler}
                  freezeSection={false}
                  freezeColumnWidth={getFreezeColWidth()}
                  toggleShowHideColumn={toggleShowHideColumn}
                  sorting={calculatedSorting}
                  sortColumn={sortColumn}
                  unsortColumn={unsortColumn}
                  calculatedSelected={calculatedSelected}
                  allRowSelectionHandler={allRowSelectionHandler}
                  dataSelectionHandler={dataSelectionHandler}
                  selectionVariant={selectionVariant}
                  scrollLeft={regularSectionScroll}
                />
                <MaterialBody
                  tableSize={calculatedSize}
                  freezeSection={false}
                  freezeColumnWidth={getFreezeColWidth()}
                  header={calculatedHeader}
                  data={calculatedData}
                  sorting={calculatedSorting}
                  calculatedSelected={calculatedSelected}
                  calculatedKeyCol={calculatedKeyCol}
                  singleRowSelectionHandler={singleRowSelectionHandler}
                  dataSelectionHandler={dataSelectionHandler}
                  selectionVariant={selectionVariant}
                  rowsPerPage={rowPerPage}
                  page={calculatedPage}
                />
              </div>
            </div>
            <MaterialFooter
              page={calculatedPage}
              rowPerPage={rowPerPage}
              data={calculatedData}
              boundaryCount={1}
              siblingCount={width > 800 ? 1 : 0}
              changePage={changePage}
              width={width}
              pagination={pagination}
              changeRowPerPage={changeRowPerPage}
              rowsOptions={rowsOptions}
            />
          </Paper>
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
    resizeColumn: true,
    freezeColumm: true,
    columnRepositioning: true,
    ordering: true
  },
  tableTools: [],
  toolIconColor: 'primary',
  selectionVariant: 'multi',
  pagination: 'detailed',
  rowsPerPageOptions: [5, 10, 25],
  defaultRowsPerPage: 10,
  strictBodyHeight: true
}

MaterialDataGrid.propTypes = {
  theme: PropTypes.object,
  className: PropTypes.object,
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
      backgroundColor: PropTypes.any,
      buttonVariant: PropTypes.oneOf(['contained', 'outlined', 'text']),
      buttonColor: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary'
      ]),
      icon: PropTypes.any,
      avaterText: PropTypes.string,
      avaterSrc: PropTypes.any,
      freeze: PropTypes.bool,
      display: PropTypes.bool,
      resize: PropTypes.bool,
      width: PropTypes.number,
      maxWidth: PropTypes.number,
      sort: PropTypes.oneOf(['asc', 'desc'])
    })
  ).isRequired,
  fitColumns: PropTypes.bool,
  data: PropTypes.array,
  searchable: PropTypes.bool,
  filterable: PropTypes.bool,
  downloadable: PropTypes.bool,
  settingsProps: PropTypes.shape({
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
  toolIconColor: PropTypes.oneOf([
    'default',
    'inherit',
    'primary',
    'secondary'
  ]),
  dataSelected: PropTypes.array,
  selectionVariant: PropTypes.oneOf(['single', 'multi']),
  dataSelectionHandler: PropTypes.func,
  pagination: PropTypes.oneOf(['simple', 'detailed']),
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  defaultRowsPerPage: PropTypes.number,
  strictBodyHeight: PropTypes.bool
}

export default MaterialDataGrid
