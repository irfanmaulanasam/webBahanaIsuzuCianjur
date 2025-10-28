import React from 'react'
import data from '../data/siteContent.json'

export default function About(){
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold"content="">{data.about.title}</h1>
      <p className="mt-4">{data.about.description}</p>
    </div>
  )
}