import { FC, ReactNode } from 'react'

import * as DialogRadix from '@radix-ui/react-dialog'

import s from './modal.module.scss'

import { Close } from 'assets/icons'
import { Typography } from 'components/ui/typography'

type ModalProps = {
  trigger: ReactNode
  title?: string
  children: ReactNode
  showCloseBtn?: boolean
}

export const Modal: FC<ModalProps> = ({ trigger, title, children, showCloseBtn = true }) => {
  return (
    <DialogRadix.Root>
      <DialogRadix.Trigger asChild>{trigger}</DialogRadix.Trigger>
      <DialogRadix.Portal>
        <DialogRadix.Overlay className={s.DialogOverlay}>
          <DialogRadix.Content className={s.DialogContent}>
            <header className={s.header}>
              <DialogRadix.Title asChild>
                <Typography as={'h2'} variant={'h2'}>
                  {title}
                </Typography>
              </DialogRadix.Title>
              {showCloseBtn && (
                <DialogRadix.Close className={s.closeButton}>
                  <Close />
                </DialogRadix.Close>
              )}
            </header>
            <div className={s.content}>{children}</div>
          </DialogRadix.Content>
        </DialogRadix.Overlay>
      </DialogRadix.Portal>
    </DialogRadix.Root>
  )
}
