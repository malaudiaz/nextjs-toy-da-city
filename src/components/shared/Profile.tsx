import Image from 'next/image'
import React from 'react'

type Props = {
    imageUrl?: string
    fullName?: string | null
}

const Profile = ({ imageUrl, fullName }: Props) => {
  return (
    <div className="flex flex-row gap-4 items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-sm">
                <Image
                  src={imageUrl || "/no-image.png"}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xl md:text-2xl font-poppins">{fullName || "Migue"}</p>
              </div>
            </div>
  )
}

export default Profile
