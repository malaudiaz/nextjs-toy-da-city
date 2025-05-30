import Link from 'next/link'
import React from 'react'

const DeleteDataPage = () => {
  return (
    <div className="container mx-auto px-6 py-8 bg-[#FAF1DE] min-h-screen">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">How to Delete Your Account/Data</h1>
          <span>Self Service:</span>
        <ul className='flex flex-col gap-3'>
            <li>Go to Settings {'>'} Privacy {'>'} "Delete Account".</li>
            <li>Confirm via email.</li>
            <li> Manual Request:</li>
            <li> Email privacy@toydacity.com with:</li>
            <li>Subject: "Data Deletion Request".</li>
            <li>Body: Specify if deleting all data or specific listings.</li>
            <li> Florida-Specific Notes Deletion completed within 30 days (per CCPA/SB 262).</li>
            <li> Transaction records may be retained for tax purposes (Florida Statute 212.03).</li>
        </ul>

      <Link href={"/"}>Full Document Link</Link>
      </div>
    </div>
  )
}

export default DeleteDataPage

