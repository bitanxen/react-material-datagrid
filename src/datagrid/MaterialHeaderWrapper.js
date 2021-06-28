import React, { useEffect, useRef } from 'react'

import MaterialHeader from './MaterialHeader'

function MaterialHeaderWrapper(props) {
  const regularRef = useRef(null)
  const freezeRef = useRef(null)
  const {
    tableSize,
    header,
    data,
    settingsProps,
    resizeHandler,
    freezeColumnHandler,
    freezeColumnWidth,
    regularColumnWidth,
    toggleShowHideColumn,
    sorting,
    sortColumn,
    unsortColumn,
    allRowSelectionHandler,
    dataSelectionHandler,
    calculatedSelected,
    selectionVariant,
    freezeScroll,
    regularScroll,
    filterCriteria,
    createUpdateFilter,
    removeFilter
  } = props

  useEffect(() => {
    regularRef.current.scrollLeft = regularScroll
  }, [regularScroll])

  useEffect(() => {
    freezeRef.current.scrollLeft = freezeScroll
  }, [freezeScroll])

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <div
        ref={freezeRef}
        style={{
          overflow: 'hidden',
          width: freezeColumnWidth
        }}
      >
        <MaterialHeader
          tableSize={tableSize}
          header={header}
          data={data}
          settingsProps={settingsProps}
          resizeHandler={resizeHandler}
          freezeColumnHandler={freezeColumnHandler}
          freezeSection={true}
          freezeColumnWidth={freezeColumnWidth}
          toggleShowHideColumn={toggleShowHideColumn}
          sorting={sorting}
          sortColumn={sortColumn}
          unsortColumn={unsortColumn}
          calculatedSelected={calculatedSelected}
          allRowSelectionHandler={allRowSelectionHandler}
          dataSelectionHandler={dataSelectionHandler}
          selectionVariant={selectionVariant}
          filterCriteria={filterCriteria}
          createUpdateFilter={createUpdateFilter}
          removeFilter={removeFilter}
        />
      </div>
      <div
        ref={regularRef}
        style={{ overflow: 'hidden', width: regularColumnWidth }}
      >
        <MaterialHeader
          tableSize={tableSize}
          header={header}
          data={data}
          settingsProps={settingsProps}
          resizeHandler={resizeHandler}
          freezeColumnHandler={freezeColumnHandler}
          freezeSection={false}
          freezeColumnWidth={freezeColumnWidth}
          toggleShowHideColumn={toggleShowHideColumn}
          sorting={sorting}
          sortColumn={sortColumn}
          unsortColumn={unsortColumn}
          calculatedSelected={calculatedSelected}
          allRowSelectionHandler={allRowSelectionHandler}
          dataSelectionHandler={dataSelectionHandler}
          selectionVariant={selectionVariant}
          filterCriteria={filterCriteria}
          createUpdateFilter={createUpdateFilter}
          removeFilter={removeFilter}
        />
      </div>
    </div>
  )
}

export default MaterialHeaderWrapper
