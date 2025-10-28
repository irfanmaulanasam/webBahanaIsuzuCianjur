import React from 'react'
import {contact} from "../data/siteContent.json"

export default function Products(){
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold">Kontak Kami</h1>
      <p className="mt-4">{contact}</p>
    </div>
  )
}