import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Isuzu Dealer</h3>
            <p className="text-sm">Alamat dealer, telepon, social media</p>
          </div>
          <div className="text-sm">© {new Date().getFullYear()} Isuzu Dealer</div>
        </div>
      </div>
    </footer>
  )
}