import React from 'react'
import { makeStyles, Select, MenuItem } from '@material-ui/core'
import clsx from 'clsx'

import MaterialPagination from './MaterialPagination'

const useStyles = makeStyles((theme) => ({
  footerRootFlex: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerRootNotFlex: {
    margin: '0 auto'
  },
  footerRoot: {
    padding: '10px 20px'
  },
  pageLink: {
    margin: '0 5px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  activePage: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

function MaterialFooter(props) {
  const {
    width,
    pagination,
    page,
    rowPerPage,
    data,
    boundaryCount,
    siblingCount,
    changePage,
    changeRowPerPage,
    rowsOptions
  } = props
  const classes = useStyles()

  return (
    <div
      className={clsx(
        width > 600 ? classes.footerRootFlex : classes.footerRootNotFlex
      )}
    >
      <div className={classes.footerRoot}>
        {data.length > 0 && (
          <MaterialPagination
            page={page}
            rowPerPage={rowPerPage}
            data={data}
            boundaryCount={boundaryCount}
            siblingCount={siblingCount}
            changePage={changePage}
            width={width}
            pagination={pagination}
          />
        )}
      </div>
      <div
        className={classes.footerRoot}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <div>
          <Select
            labelId="page-per-row-select-label"
            id="page-per-row-select"
            value={rowsOptions.includes(rowPerPage) ? rowPerPage : ''}
            onChange={changeRowPerPage}
          >
            {rowsOptions.map((o, index) => (
              <MenuItem value={o} key={index}>
                {o}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}
        >
          {data.length} records
        </div>
      </div>
    </div>
  )
}

export default MaterialFooter
