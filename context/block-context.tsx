"use client"
import React, { createContext, useContext, useState, ReactNode } from "react"

interface BlockContextType {
  isBlock: boolean
  setIsBlock: (isBlock: boolean) => void
}

const BlockContext = createContext<BlockContextType | undefined>(undefined)

export const useBlock = () => {
  const context = useContext(BlockContext)
  if (context === undefined) {
    throw new Error("useBlock must be used within a BlockProvider")
  }
  return context
}

export const BlockProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isBlock, setIsBlock] = useState(false)

  return (
    <BlockContext.Provider value={{ isBlock, setIsBlock }}>
      {children}
    </BlockContext.Provider>
  )
}
