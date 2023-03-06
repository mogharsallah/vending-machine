import { FC } from 'react'

interface Props {
  color?: 'primary' | 'white'
}
export const LoadingIndicator: FC<Props> = ({ color = 'white' }) => (
  <div className="lds-ellipsis">
    <div data-color={color} className="data-[color=primary]:bg-sky-500"></div>
    <div data-color={color} className="data-[color=primary]:bg-sky-500"></div>
    <div data-color={color} className="data-[color=primary]:bg-sky-500"></div>
    <div data-color={color} className="data-[color=primary]:bg-sky-500"></div>
  </div>
)
