import { useRef } from 'react'

export default function useScroll() {
  const elRef = useRef(null)
  const executeScroll = () => {
    console.log(elRef.current)
    elRef.current.scrollIntoView()
  }

  return [executeScroll, elRef]
}
