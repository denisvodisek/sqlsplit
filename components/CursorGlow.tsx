'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let frameId = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15
      glow.style.transform = `translate3d(${currentX - 160}px, ${currentY - 160}px, 0)`
      frameId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', onPointerMove)
    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
}
