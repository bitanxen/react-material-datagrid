import React, { useState } from 'react'
import { IconButton, Popover, Typography } from '@material-ui/core'
import { Edit, Close, Add } from '@material-ui/icons'
import AddUpdateFilter from './filter/AddUpdateFilter'

function HeaderFilter(props) {
  const {
    closeHandler,
    headerFilter,
    filterCriteria,
    createUpdateFilter,
    removeFilter
  } = props
  const [addFilter, setAddFilter] = useState(false)
  const [editFilter, setEditFilter] = useState(null)

  const getAppliedFilters = () => {
    if (filterCriteria.filters && headerFilter.header) {
      return filterCriteria.filters[headerFilter.header.colId]
        ? filterCriteria.filters[headerFilter.header.colId]
        : []
    } else {
      return []
    }
  }

  const updateFilter = (f) => {
    setAddFilter(true)
    setEditFilter(f)
  }

  const deleteFilter = (f) => {
    if (headerFilter.header) {
      removeFilter(headerFilter.header.colId, f)
    }
  }

  return (
    <Popover
      open={Boolean(headerFilter.target)}
      anchorEl={headerFilter.target}
      onClose={() => {
        closeHandler()
        setAddFilter(false)
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <div
        style={{
          width: '700px',
          maxWidth: '700px',
          maxHeight: '400px',
          overflow: 'auto'
        }}
      >
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
          <div style={{ width: '40%' }}>
            <Typography variant="caption">Value</Typography>
          </div>
          <div style={{ width: '5%' }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setAddFilter(true)
              }}
              disabled={addFilter}
            >
              <Add fontSize="inherit" />
            </IconButton>
          </div>
        </div>
        {addFilter && (
          <AddUpdateFilter
            headerFilter={headerFilter}
            closeAddFilter={() => {
              setAddFilter(false)
              setEditFilter(null)
            }}
            addedFilters={getAppliedFilters()}
            editFilter={editFilter}
            createUpdateFilter={createUpdateFilter}
          />
        )}
        {getAppliedFilters()
          .filter((f) => {
            if (editFilter === null) {
              return true
            }
            return editFilter.filterId !== f.filterId
          })
          .map((f, index) => (
            <div
              key={index}
              style={{
                borderBottom: '0.5px solid #CCCCCC'
              }}
            >
              <div
                style={{
                  padding: '5px 10px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '15%' }}>
                  <Typography variant="subtitle2">
                    {f.conditionOperator}
                  </Typography>
                </div>
                <div style={{ width: '25%' }}>
                  <Typography variant="subtitle2">
                    {headerFilter.header.colName}
                  </Typography>
                </div>
                <div style={{ width: '15%' }}>
                  <Typography variant="subtitle2">{f.operator}</Typography>
                </div>
                <div style={{ width: '35%' }}>
                  <Typography variant="subtitle2">{f.filterValue}</Typography>
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
                    onClick={() => updateFilter(f)}
                  >
                    <Edit fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="default"
                    onClick={() => deleteFilter(f)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Popover>
  )
}

export default HeaderFilter
