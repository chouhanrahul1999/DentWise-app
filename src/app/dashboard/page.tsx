import MainActions from '@/components/dashboard/MainActions'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import Navbar from '@/components/Navbar'
import React from 'react'

const Dashboard = () => {
  return (
    <>
      <Navbar />
      Dashboard
      <div className='max-w-7xl mx-auto px-6 py-8 pt-24'>
        <WelcomeSection />
        <MainActions />
      </div>
    </>
  )
}

export default Dashboard
