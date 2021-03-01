import React from 'react'
import PropTypes from 'prop-types'

function MaterialBody(props) {
  return <div>MaterialBody</div>
}

MaterialBody.propTypes = {
  tableSize: PropTypes.string.isRequired,
  freezeSection: PropTypes.bool.isRequired,
  data: PropTypes.array
}

export default MaterialBody
