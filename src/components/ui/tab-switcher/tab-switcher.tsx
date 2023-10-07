import { FC, ReactNode } from 'react'

import * as Tabs from '@radix-ui/react-tabs'
import { TabsTriggerProps } from '@radix-ui/react-tabs'

import s from './tab-switcher.module.scss'

import { Typography } from 'components/ui/typography'

type TabSwitcherProps = {
  value: string
  onValueChange: (value: string) => void
  label: string
  children: ReactNode
}

export const TabSwitcher: FC<TabSwitcherProps> = ({ label, children, value, onValueChange }) => {
  return (
    <div>
      <Typography variant="body2" className={s.title}>
        {label}
      </Typography>
      <Tabs.Root className={s.tabsRoot} value={value} onValueChange={onValueChange}>
        <Tabs.List className={s.tabsList}>{children}</Tabs.List>
      </Tabs.Root>
    </div>
  )
}

export const TabSwitcherItem: FC<TabsTriggerProps> = props => {
  return <Tabs.Trigger className={s.tabsTrigger} {...props} />
}
