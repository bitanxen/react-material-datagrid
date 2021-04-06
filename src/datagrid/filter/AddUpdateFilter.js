import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  FormControl,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core'
import { Done, Close } from '@material-ui/icons'
import FilterValue from './FilterValue'
import { getOperatorOptions } from '../../utils/ApplicationUtils'

function AddUpdateFilter(props) {
  const { headerFilter, editFilter, closeAddFilter, createUpdateFilter } = props
  const [targetFilter, setTargetFilter] = useState({
    filterId: null,
    conditionOperator: 'AND',
    operator: '',
    filterValue: ''
  })

  useEffect(() => {
    if (editFilter) {
      setTargetFilter({
        filterId: editFilter.filterId,
        conditionOperator: editFilter.conditionOperator,
        operator: editFilter.operator,
        filterValue: editFilter.filterValue
      })
    } else {
      setTargetFilter({
        filterId: uuidv4(),
        conditionOperator: 'AND',
        operator: '',
        filterValue: ''
      })
    }
  }, [editFilter])

  const updateField = (fieldName, value) => {
    setTargetFilter({
      ...targetFilter,
      [fieldName]: value
    })
  }

  const addFilterEnabled = () => {
    if (
      targetFilter.operator !== null &&
      targetFilter.operator !== undefined &&
      targetFilter.operator.length > 0 &&
      targetFilter.filterValue !== null &&
      targetFilter.filterValue !== undefined &&
      targetFilter.filterValue.length > 0
    ) {
      return true
    }
    return false
  }

  const submitFilter = () => {
    createUpdateFilter(headerFilter.header.colId, targetFilter)
    closeAddFilter()
    setTargetFilter({
      filterId: null,
      conditionOperator: 'AND',
      operator: '',
      filterValue: ''
    })
  }

  const getOperators = () => {
    if (headerFilter.header) {
      return getOperatorOptions(headerFilter.header)
    }
    return []
  }

  return (
    <div
      style={{
        padding: '5px 10px',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ width: '15%' }}>
        <FormControl style={{ width: '100%' }} size="small">
          <Select
            value={targetFilter.conditionOperator}
            onChange={(e) => updateField('conditionOperator', e.target.value)}
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ width: '25%' }}>
        <TextField
          fullWidth
          disabled
          size="small"
          value={headerFilter.header.colName}
        />
      </div>
      <div style={{ width: '15%' }}>
        {getOperators().length > 0 ? (
          <FormControl style={{ width: '100%' }} size="small">
            <Select
              onChange={(e) => updateField('operator', e.target.value)}
              value={targetFilter.operator}
            >
              {getOperators().map((o, index) => (
                <MenuItem key={index} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography>Invalid Data Type</Typography>
        )}
      </div>
      <div style={{ width: '35%' }}>
        <FilterValue
          filter={targetFilter}
          header={headerFilter.header}
          onChange={(e) => updateField('filterValue', e.target.value)}
        />
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
          color="primary"
          disabled={!addFilterEnabled()}
          onClick={() => {
            submitFilter()
          }}
        >
          <Done fontSize="inherit" />
        </IconButton>
        <IconButton
          size="small"
          color="default"
          onClick={() => {
            closeAddFilter()
          }}
        >
          <Close fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  )
}

export default AddUpdateFilter
