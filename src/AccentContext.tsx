import { createContext, useContext, useState, type ReactNode } from 'react'

interface AccentCtx {
  color: string
  setColor: (c: string) => void
}

const AccentContext = createContext<AccentCtx>({ color: '#39FF14', setColor: () => {} })

export function AccentProvider({ initial, children }: { initial: string; children: ReactNode }) {
  const [color, setColor] = useState(initial)
  return <AccentContext.Provider value={{ color, setColor }}>{children}</AccentContext.Provider>
}

export function useAccentColor(): string {
  return useContext(AccentContext).color
}

export function useSetAccentColor(): (c: string) => void {
  return useContext(AccentContext).setColor
}
