import React from 'react'
import { NavLink } from 'react-router-dom'
import data from '../data/siteContent.json'

export default function Header(){
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <img src={data.header.logoDealer} alt="Dealer" className="h-8" />
          <img src={data.header.logoRPRI} alt="RPRI" className="h-8" />
        </div>
        <nav className="flex items-center gap-6">
          {data.header.menu.map((m)=> (
            <NavLink key={m.path} to={m.path} className={({isActive}) => isActive ? 'font-semibold text-black' : 'text-gray-700'}>{m.title}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}