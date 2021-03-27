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

    return defaultRowsPerPage * 40 + 17
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        height: getBodyHeight(),
        maxHeight: getBodyHeight()
      }}
    >
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          width: freezeColumnWidth,
          boxShadow: '3px 0px 1px #DDD',
          transition: 'width 0.5s ease-in-out'
        }}
        ref={freezeRef}
        onScroll={() => {
          freezeScrollHandler(freezeRef.current.scrollLeft)
        }}
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
        style={{
          overflow: 'auto',
          width: regularColumnWidth,
          transition: 'width 0.5s ease-in-out'
        }}
        ref={regularRef}
        onScroll={() => {
          freezeRef.current.scrollTop = regularRef.current.scrollTop
          regularScrollHandler(regularRef.current.scrollLeft)
        }}
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
