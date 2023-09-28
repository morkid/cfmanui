export function fireEvent(element, eventName, detail) {
  var event = new CustomEvent(eventName, { detail: detail })
  element.dispatchEvent(event)
}