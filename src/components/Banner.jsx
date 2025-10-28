import React from 'react'

export default function Banner({data}){
  return (
    <div className="w-full h-64 md:h-96 bg-cover bg-center" style={{backgroundImage: `url(${data.image})`}}>
      <div className="container h-full flex items-center">
        <div className="bg-white/80 p-6 rounded-md shadow-md">
          <h1 className="text-3xl font-bold mb-2">{data.headline}</h1>
          <button className="mt-2 px-4 py-2 bg-[color:var(--isuzu-red)] text-white rounded">{data.cta}</button>
        </div>
      </div>
    </div>
  )
}