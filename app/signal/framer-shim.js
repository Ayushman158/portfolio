/* Stand-ins for the Framer runtime APIs a vendored Framer component imports. */
export const addPropertyControls = () => {}
export const ControlType = new Proxy({}, { get: (_, key) => key })
export const useIsStaticRenderer = () => false
