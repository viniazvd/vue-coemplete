function bindEvent (el, event, callback, ...options) {
  el.addEventListener(event, callback, ...options)

  return () => el.removeEventListener(event, callback, ...options)
}

export default bindEvent
