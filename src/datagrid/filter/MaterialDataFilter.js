import React, { useState } from 'react'
import {
  makeStyles,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core'
import { Add, Close, Edit } from '@material-ui/icons'

import AddUpdateFilter from './AddUpdateFilter'
import { isNonSearchableColumn } from '../../utils/ApplicationUtils'

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    width: '100%',
    position: 'absolute',
    height: '250px',
    animation: `$filter 0.3s ${theme.transitions.easing.easeInOut}`,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid black'
  },
  '@keyframes filter': {
    from: {
      height: '0px'
    },
    to: {
      height: '250px'
    }
  }
}))

function MaterialDataFilter(props) {
  const classes = useStyles()

  const {
    show,
    header,
    filterCriteria,
    createUpdateFilter,
    removeFilter,
    close
  } = props

  const [addFilter, setAddFilter] = useState(false)
  const [editFilter, setEditFilter] = useState(null)
  const [headerFilter, setHeaderFilter] = useState({
    header: null
  })

  const { filters } = filterCriteria

  const keyFilterKeys = () => {
    return filters ? Object.keys(filters) : []
  }

  const getColumnDetails = (colId) => {
    const h = header ? header.filter((h) => h.colId === colId) : null
    return h ? h[0] : {}
  }

  const getFilterArray = (colId) => {
    return filters && filters[colId]
  }

  const getAppliedFilters = () => {
    if (filterCriteria.filters && headerFilter.header) {
      return filterCriteria.filters[headerFilter.header.colId]
        ? filterCriteria.filters[headerFilter.header.colId]
        : []
    } else {
      return []
    }
  }

  const updateField = (colId) => {
    setAddFilter(false)
    setHeaderFilter({
      header: getColumnDetails(colId)
    })
  }

  const updateFilter = (colId, f) => {
    setEditFilter(f)
    setHeaderFilter({
      header: getColumnDetails(colId)
    })
  }

  const deleteFilter = (colId, f) => {
    removeFilter(colId, f)
  }

  return (
    show && (
      <div
        style={{
          width: '100%',
          position: 'relative',
          zIndex: 999,
          opacity: '0.97'
        }}
      >
        <div className={classes.filterContainer}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 30px',
              width: '100%',
              backgroundColor: 'white',
              opacity: '1'
            }}
          >
            <div>
              <Typography variant="h6">Filters</Typography>
            </div>
            <div>
              <IconButton
                color="primary"
                onClick={() => {
                  setAddFilter(true)
                }}
              >
                <Add />
              </IconButton>
              <IconButton color="primary" onClick={() => close()}>
                <Close />
              </IconButton>
            </div>
          </div>
          {addFilter && (
            <div style={{ width: '200px', padding: '10px' }}>
              <FormControl style={{ width: '100%' }} size="small">
                <Select onChange={(e) => updateField(e.target.value)} value="">
                  {header
                    .filter((h) => !isNonSearchableColumn(header, h.colId))
                    .map((h, index) => (
                      <MenuItem key={index} value={h.colId}>
                        {h.colName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          )}
          {headerFilter && headerFilter.header && (
            <div style={{ padding: '10px' }}>
              <AddUpdateFilter
                headerFilter={headerFilter}
                closeAddFilter={() => {
                  setAddFilter(false)
                  setHeaderFilter({
                    header: null
                  })
                }}
                addedFilters={getAppliedFilters()}
                editFilter={editFilter}
                createUpdateFilter={createUpdateFilter}
              />
            </div>
          )}
          <div>
            {!filters ||
            filters.length === 0 ||
            Object.values(filters)[0].length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                <Typography variant="body1">No Filters Added</Typography>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', padding: '5px 10px' }}>
                  <div style={{ width: '15%' }}>
                    <Typography variant="caption">Condition</Typography>
                  </div>
                  <div style={{ width: '25%' }}>
                    <Typography variant="caption">Column</Typography>
                  </div>
                  <div style={{ width: '15%' }}>
                    <Typography variant="caption">Operator</Typography>
                  </div>
                  <div style={{ width: '45%' }}>
                    <Typography variant="caption">Value</Typography>
                  </div>
                </div>
                {keyFilterKeys().map((colId, i) => (
                  <div key={i}>
                    {getFilterArray(colId) &&
                      getFilterArray(colId).map((f, j) => (
                        <div
                          key={j}
                          style={{
                            padding: '5px 10px',
                            display: 'flex'
                          }}
                        >
                          <div style={{ width: '15%' }}>
                            <Typography variant="subtitle2">
                              {f.conditionOperator}
                            </Typography>
                          </div>
                          <div style={{ width: '25%' }}>
                            <Typography variant="subtitle2">
                              {getColumnDetails(colId).colName}
                            </Typography>
                          </div>
                          <div style={{ width: '15%' }}>
                            <Typography variant="subtitle2">
                              {f.operator}
                            </Typography>
                          </div>
                          <div style={{ width: '35%' }}>
                            <Typography variant="subtitle2">
                              {f.filterValue}
                            </Typography>
                          </div>
                          <div
                            style={{
                              width: '10%',
                              display: 'flex',
                              justifyContent: 'space-around'
                            }}
                          >
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => updateFilter(colId, f)}
                            >
                              <Edit fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => deleteFilter(colId, f)}
                            >
                              <Close fontSize="inherit" />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default MaterialDataFilter
