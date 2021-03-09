import React from 'react'
import {
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage
} from '@material-ui/icons'
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

function DetailPagination(props) {
  const classes = useStyles()
  const {
    page,
    rowPerPage,
    data,
    boundaryCount,
    siblingCount,
    changePage
  } = props

  const count =
    data && data.length > 0
      ? parseInt(data.length / rowPerPage) +
        (data.length % rowPerPage > 0 ? 1 : 0)
      : 0

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count
  )
  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    endPages[0] - 2
  )

  const itemList = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['ellipsis']
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['ellipsis']
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),
    ...endPages
  ]

  return (
    <div className={classes.paginationRoot}>
      <div className={classes.pageLink}>
        <IconButton disabled={page === 1} onClick={() => changePage(1)}>
          <FirstPage fontSize="small" />
        </IconButton>
      </div>
      <div className={classes.pageLink}>
        <IconButton
          disabled={page - 1 === 0}
          onClick={() => changePage(page - 1)}
        >
          <NavigateBefore fontSize="small" />
        </IconButton>
      </div>
      {itemList.map((item, index) => (
        <div key={index} className={classes.pageLink}>
          {item === 'ellipsis' ? (
            <IconButton size="medium" disabled>
              <span>...</span>
            </IconButton>
          ) : (
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
          )}
        </div>
      ))}
      <div className={classes.pageLink}>
        <IconButton
          disabled={page + 1 > count}
          onClick={() => changePage(page + 1)}
        >
          <NavigateNext fontSize="small" />
        </IconButton>
      </div>
      <div className={classes.pageLink}>
        <IconButton disabled={page === count} onClick={() => changePage(count)}>
          <LastPage fontSize="small" />
        </IconButton>
      </div>
    </div>
  )
}

export default DetailPagination
