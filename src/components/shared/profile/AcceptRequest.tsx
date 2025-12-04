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

    const handleAccept = async () => {
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
            <Button type="submit" onClick={handleAccept}>{t("acceptBtn")}</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
