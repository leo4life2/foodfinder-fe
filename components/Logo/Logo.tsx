import React from 'react'
import Image from 'next/image'
import './Logo.css'

function Logo() {
  return (
    <Image
        src="/logo.svg"
        alt="Food Finder"
        width={201}
        height={60}
        className='logo'
    />
  )
}

export default Logo