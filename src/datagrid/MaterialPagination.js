import React from 'react'

import DetailPagination from './pagination/DetailPagination'
import SimplePagination from './pagination/SimplePagination'

function MaterialPagination(props) {
  const { width, pagination } = props

  return pagination === 'detailed' ? (
    width < 1000 ? (
      <SimplePagination {...props} />
    ) : (
      <DetailPagination {...props} />
    )
  ) : (
    <SimplePagination {...props} />
  )
}

export default MaterialPagination
