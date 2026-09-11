declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode } from 'react'
  type Geography = { rsmKey: string; properties?: Record<string, string | number | null | undefined> }
  type ZoomMove = { zoom: number }
  export const ComposableMap: ComponentType<Record<string, unknown> & { children?: ReactNode }>
  export const Geographies: ComponentType<{ geography: string; children: (value: { geographies: Geography[] }) => ReactNode }>
  export const Geography: ComponentType<{ geography: Geography; onClick?: () => void; style?: Record<string, Record<string, string | number>> }>
  export const ZoomableGroup: ComponentType<{ zoom?: number; onMoveEnd?: (value: ZoomMove) => void; children?: ReactNode }>
}
