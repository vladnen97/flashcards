import { SVGProps, Ref, forwardRef, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" ref={ref} {...props}>
    <g clipPath="url(#a)">
      <path
        fill="var(--color-dark-100)"
        d="m17.3 16-2.9-2.8a6.6 6.6 0 0 0 .3-7.7 6.7 6.7 0 1 0-1.4 9l2.8 2.8a.8.8 0 0 0 1.3-.3.8.8 0 0 0-.1-1ZM4.2 9.3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)
const ForwardRef = forwardRef(SvgComponent)
const Memo = memo(ForwardRef)

export default Memo
