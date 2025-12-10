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
import { useTranslations } from "next-intl"; // ✅ Importa el hook

type Props = {
    id: string,
    source: string
}

export function AcceptRequest({ id, source }: Props) {
  const t = useTranslations(source); // o el namespace que uses
  const [open, setOpen] = useState(false)
  const router = useRouter()

    const [isProcessing, setIsProcessing] = useState(false)

    const handleAccept = async () => {
      setIsProcessing(true)
      try {
        const result = await confirmRequest(id)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(t("confirmSuccess"))
          setOpen(false)
          router.refresh()
        }
      } catch {
        toast.error(t("errorMessage"))
      } finally {
        setIsProcessing(false)
      }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">{t("select")}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("acceptRequest")}</DialogTitle>
            <DialogDescription>
              {t("questionAcceptRequest")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancelBtn")}</Button>
            </DialogClose>
            <Button type="submit" onClick={handleAccept} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  {t("processing")}
                </>
              ) : (
                t("acceptBtn")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
