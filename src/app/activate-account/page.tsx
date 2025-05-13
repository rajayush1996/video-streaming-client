// app/activate-account/page.tsx
import React, { Suspense } from 'react'
import ActivateAccountInner from './ActivateAccountInner'

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>Loading...</div>}>
      <ActivateAccountInner />
    </Suspense>
  )
}
