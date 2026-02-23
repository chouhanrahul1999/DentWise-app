import React from 'react'
import DentalHealthOverView from './DentalHealthOverView'
import NextAppointment from './NextAppointment'

const ActivityOverview = () => {
  return (
    <div className='grid lg:grid-cols-3 gap-6'>
        <DentalHealthOverView />
        <NextAppointment />
    </div>
  )
}

export default ActivityOverview
