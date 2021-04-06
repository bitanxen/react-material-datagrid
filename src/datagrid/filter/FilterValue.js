import { TextField, FormControl, Select, MenuItem } from '@material-ui/core'
import React from 'react'

function FilterValue(props) {
  const { header, filter, onChange } = props

  const numericValueChange = (e) => {
    if (!isNaN(e.target.value)) {
      onChange(e)
    }
  }

  const getFilterValue = () => {
    switch (header.dataType) {
      case 'string': {
        return (
          <div>
            <TextField
              fullWidth
              size="small"
              value={filter.filterValue}
              onChange={onChange}
            />
          </div>
        )
      }
      case 'number': {
        return (
          <div>
            <TextField
              fullWidth
              size="small"
              value={filter.filterValue}
              onChange={(e) => numericValueChange(e)}
            />
          </div>
        )
      }
      case 'boolean': {
        return (
          <div>
            <FormControl style={{ width: '100%' }} size="small">
              <Select onChange={onChange} value={filter.filterValue}>
                <MenuItem value="YES">Yes / True</MenuItem>
                <MenuItem value="NO">No / False</MenuItem>
              </Select>
            </FormControl>
          </div>
        )
      }
      case 'date': {
        return (
          <div>
            <TextField fullWidth size="small" onChange={onChange} />
          </div>
        )
      }
    }
  }

  return getFilterValue()
}

export default FilterValue
