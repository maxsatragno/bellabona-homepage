'use client'

import { useEffect, useState } from 'react'

import { Modal } from '@/components/primitives/Modal'
import { OPEN_DEMO_MODAL_EVENT } from '@/lib/modal-events'

type Props = {
  demoTitle: string
  demoBody: string
  closeLabel: string
}

export function SiteModals({ demoTitle, demoBody, closeLabel }: Props) {
  const [demoOpen, setDemoOpen] = useState(false)

  useEffect(() => {
    const open = () => setDemoOpen(true)
    window.addEventListener(OPEN_DEMO_MODAL_EVENT, open)
    return () => window.removeEventListener(OPEN_DEMO_MODAL_EVENT, open)
  }, [])

  return (
    <Modal open={demoOpen} onClose={() => setDemoOpen(false)} title={demoTitle} closeLabel={closeLabel}>
      {demoBody}
    </Modal>
  )
}
