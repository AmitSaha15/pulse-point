import StatCard from '@/components/StatCard'
import { columns, Payment } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Admin = async () => {

    const recentAppointments = await getRecentAppointmentList()

  return (
    <div className='mx-auto flex flex-col space-y-14 max-w-7xl'>
        <header className='admin-header'>
            <Link href="/" className='cursor-pointer'>
                <Image 
                    src="/assets/icons/pulse-point-logo.svg"
                    height={32}
                    width={162}
                    alt='logo'
                    className='h-8 w-fit'
                />
            </Link>

            <p className='text-16-semibold text-green-500'>Admin Dashboard</p>
        </header>

        <main className='admin-main'>
            <section className='w-full space-y-4'>
                <h1 className='header'>Welcome, Admin</h1>
                <p className='text-dark-700'>Start the day with managing new appointments</p>
            </section>

            <section className='admin-stat'>
                <StatCard
                    type="appointments"
                    count={recentAppointments.scheduledCount}
                    label="Scheduled appointments"
                    icon="/assets/icons/appointments.svg"
                />
                <StatCard
                    type="pending"
                    count={recentAppointments.pendingCount}
                    label="Pending appointments"
                    icon="/assets/icons/pending.svg"
                />
                <StatCard
                    type="cancelled"
                    count={recentAppointments.cancelledCount}
                    label="Cancelled appointments"
                    icon="/assets/icons/cancelled.svg"
                />
            </section>

            <DataTable columns={columns} data={recentAppointments.documents} />
        </main>
    </div>
  )
}

export default Admin