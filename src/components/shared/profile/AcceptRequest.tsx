"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { confirmRequest } from "@/lib/actions/toysAction"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
    id: string
}

export function AcceptRequest({ id }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

    const handleAccept = async () => {
        try {
            const result = await confirmRequest(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Request accepted")
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast.error("Error accepting request")
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">Select</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accept request</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleAccept}>Accept</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
