"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteToy } from "@/lib/actions/toysAction";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const DeleteButton = ({ id }: { id: string }) => {
    const t = useTranslations("config");
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      await deleteToy(id);
      router.refresh();
      toast.success(t("ToastSuccesfully"));
    } catch (err) {
      toast.error(t("ToastError"));
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="bg-red-700 text-white px-4 rounded-lg">
        {t("Delete")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("DeleteQuestion")}</DialogTitle>
          <DialogDescription>
           {t("DeleteDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("Cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => handleDelete(id)}>
               {t("Delete")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
