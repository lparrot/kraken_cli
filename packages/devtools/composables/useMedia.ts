import { breakpointsTailwind } from '@vueuse/core'

export const useMedia = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const current = breakpoints.current()
  const isDesktop = breakpoints.greaterOrEqual('lg')
  const isTablet = breakpoints.isInBetween('md', 'lg')
  const isTabletOrMobile = breakpoints.smaller('lg')
  const isMobile = breakpoints.smaller('sm')

  return { current, isDesktop, isTablet, isMobile, isTabletOrMobile }
}
