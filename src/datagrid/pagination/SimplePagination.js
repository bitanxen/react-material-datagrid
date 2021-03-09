import React from 'react'
import { FirstPage, LastPage } from '@material-ui/icons'
import { makeStyles, IconButton } from '@material-ui/core'
import clsx from 'clsx'

import { range } from '../../utils/ApplicationUtils'

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    display: 'flex',
    justifyContent: 'center'
  },
  pageLink: {
    margin: '0 5px'
  },
  activePage: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

function SimplePagination(props) {
  const classes = useStyles()
  const { page, rowPerPage, data, changePage } = props

  const count =
    data && data.length > 0
      ? parseInt(data.length / rowPerPage) +
        (data.length % rowPerPage > 0 ? 1 : 0)
      : 0

  const start = Math.max(1, page - 1)
  const end = Math.min(start + 2, count)

  const itemList = range(start, end)

  return (
    <div className={classes.paginationRoot}>
      <div className={classes.pageLink}>
        <IconButton disabled={page === 1} onClick={() => changePage(1)}>
          <FirstPage fontSize="small" />
        </IconButton>
      </div>
      {itemList.map((item, index) => (
        <div key={index} className={classes.pageLink}>
          <IconButton
            size="medium"
            className={clsx(item === page ? classes.activePage : '')}
            onClick={() => changePage(item)}
          >
            <span
              style={{
                height: 20,
                width: 20,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item}
            </span>
          </IconButton>
        </div>
      ))}
      <div className={classes.pageLink}>
        <IconButton disabled={page === count} onClick={() => changePage(count)}>
          <LastPage fontSize="small" />
        </IconButton>
      </div>
    </div>
  )
}

export default SimplePagination
