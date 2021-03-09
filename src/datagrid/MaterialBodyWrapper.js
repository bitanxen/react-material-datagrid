import React, { useRef } from 'react'

import MaterialBody from './MaterialBody'

function MaterialBodyWrapper(props) {
  const regularRef = useRef(null)
  const freezeRef = useRef(null)
  const {
    tableSize,
    freezeColumnWidth,
    regularColumnWidth,
    header,
    data,
    sorting,
    calculatedSelected,
    calculatedKeyCol,
    singleRowSelectionHandler,
    dataSelectionHandler,
    page,
    rowsPerPage,
    freezeScrollHandler,
    regularScrollHandler,
    strictBodyHeight,
    defaultRowsPerPage
  } = props

  const getBodyHeight = () => {
    if (!strictBodyHeight) {
      return 'auto'
    }

    return defaultRowsPerPage * 40
  }

  return (
    <div style={{ width: '100%', display: 'flex', maxHeight: getBodyHeight() }}>
      <div
        style={{
          overflow: 'auto',
          width: freezeColumnWidth,
          boxShadow: '3px 0px 1px #DDD'
        }}
        ref={freezeRef}
        onScroll={() => freezeScrollHandler(freezeRef.current.scrollLeft)}
      >
        <MaterialBody
          tableSize={tableSize}
          freezeSection={true}
          freezeColumnWidth={freezeColumnWidth}
          header={header}
          data={data}
          sorting={sorting}
          calculatedSelected={calculatedSelected}
          calculatedKeyCol={calculatedKeyCol}
          singleRowSelectionHandler={singleRowSelectionHandler}
          dataSelectionHandler={dataSelectionHandler}
          rowsPerPage={rowsPerPage}
          page={page}
        />
      </div>
      <div
        style={{ overflow: 'auto', width: regularColumnWidth }}
        ref={regularRef}
        onScroll={() => regularScrollHandler(regularRef.current.scrollLeft)}
      >
        <MaterialBody
          tableSize={tableSize}
          freezeSection={false}
          freezeColumnWidth={freezeColumnWidth}
          header={header}
          data={data}
          sorting={sorting}
          calculatedSelected={calculatedSelected}
          calculatedKeyCol={calculatedKeyCol}
          singleRowSelectionHandler={singleRowSelectionHandler}
          dataSelectionHandler={dataSelectionHandler}
          rowsPerPage={rowsPerPage}
          page={page}
        />
      </div>
    </div>
  )
}

export default MaterialBodyWrapper
