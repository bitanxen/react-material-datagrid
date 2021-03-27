import { useEffect, useState, useCallback } from 'react'
import dataGridService from '../service/DataGridService'

export default function useWidth(elementRef) {
  const [width, setWidth] = useState(null)

  const updateWidth = useCallback(() => {
    if (elementRef && elementRef.current) {
      const { width } = elementRef.current.getBoundingClientRect()
      setWidth(width)
    }
  }, [elementRef])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [updateWidth])

  useEffect(() => {
    dataGridService.on('resize', () => {
      setTimeout(() => {
        updateWidth()
      }, 500)
    })
  }, [updateWidth])

  return width
}
