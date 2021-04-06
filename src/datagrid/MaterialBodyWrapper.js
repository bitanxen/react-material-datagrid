import { makeStyles, CircularProgress, Typography } from '@material-ui/core'
import React, { useRef } from 'react'

import MaterialBody from './MaterialBody'

const useStyles = makeStyles((theme) => ({
  '@global': {
    'div.material-data-grid-body::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    'div.material-data-grid-body::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
      backgroundColor: theme.palette.primary[100]
    },
    'div.material-data-grid-body::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary[300],
      border: '2px solid #555555'
    },
    'div.material-data-grid-body::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.palette.primary[500],
      border: '2px solid #555555'
    }
  },
  root: {
    display: 'flex',
    width: '100%'
  }
}))

function MaterialBodyWrapper(props) {
  const classes = useStyles()
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
    defaultRowsPerPage,
    internalMessage
  } = props

  const getBodyHeight = () => {
    if (!strictBodyHeight) {
      return 'auto'
    }

    return defaultRowsPerPage * 40 + 17
  }

  return (
    <div
      className={classes.root}
      style={{
        height: getBodyHeight(),
        maxHeight: getBodyHeight()
      }}
    >
      {internalMessage ? (
        <div style={{ margin: 'auto', display: 'flex' }}>
          {internalMessage && internalMessage.startsWith('Loading') && (
            <CircularProgress size={20} />
          )}
          <div style={{ marginLeft: '10px' }}>
            <Typography variant="body2">{internalMessage}</Typography>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              width: freezeColumnWidth,
              boxShadow: '3px 0px 1px #DDD',
              transition: 'width 0.5s ease-in-out'
            }}
            className="material-data-grid-body"
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
            className="material-data-grid-body"
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
        </>
      )}
    </div>
  )
}

export default MaterialBodyWrapper
