import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Typography } from '@material-ui/core'

import { stableSort, getSorting } from '../utils/ApplicationUtils'

const useStyles = makeStyles((theme) => ({
  bodyWrapper: {
    width: 'auto'
  },
  bodyRow: {
    display: 'flex',
    width: '100%'
  },
  bodyCell: {
    borderBottom: '0.5px solid #D3D5D9'
  }
}))

function MaterialBody(props) {
  const classes = useStyles()
  const { tableSize, freezeSection, header, data, sorting } = props
  return (
    <div className={classes.bodyWrapper}>
      {stableSort(data, getSorting(sorting)).map((row, index) => (
        <React.Fragment key={index}>
          <div className={classes.bodyRow}>
            {header
              .filter((h) => h.display)
              .filter((h) => h.freeze === freezeSection)
              .map((h) => (
                <div
                  className={classes.bodyCell}
                  style={{
                    minWidth: h.targetWidth,
                    width: h.targetWidth,
                    padding: '10px 2px'
                  }}
                  key={h.colId}
                >
                  <Typography variant="body2">{row[h.colId]}</Typography>
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
  header: PropTypes.array.isRequired,
  data: PropTypes.array,
  sorting: PropTypes.object
}

export default React.memo(MaterialBody)
