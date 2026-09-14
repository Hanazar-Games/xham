import { useLayoutEffect, useId, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const backdropPress = useRef(false)
  useLayoutEffect(() => {
    const dialog = ref.current!
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onPointerDown={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        backdropPress.current =
          event.target === event.currentTarget &&
          (event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom)
      }}
      onPointerCancel={() => {
        backdropPress.current = false
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || !backdropPress.current) return
        backdropPress.current = false
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose()
      }}
    >
      <button className="icon-button dialog-close" aria-label="关闭" onClick={onClose}>
        <Icon name="close" />
      </button>
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  )
}
