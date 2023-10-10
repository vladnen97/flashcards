import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

import { RadioGroup, RadioGroupProps } from 'components/ui/radio-group'

type ControlledRadioGroupProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<RadioGroupProps, 'onChange' | 'value' | 'id'>

export const ControlledRadioGroup = <T extends FieldValues>({
  control,
  name,
  ...radioGroupProps
}: ControlledRadioGroupProps<T>) => {
  const { field } = useController({
    control,
    name,
  })

  return <RadioGroup {...radioGroupProps} {...field} />
}
