import { useForm } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import { useJourneys } from "../hooks/useJourneys";
import { useState } from "react";

interface JourneyForm {
  name: string;
}

export function CreateJourneyForm() {
  const [open, setOpen] = useState(false);
  const { createJourney } = useJourneys();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JourneyForm>();

  const onSubmit = (data: JourneyForm) => {
    createJourney(data.name);
    reset();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Create Journey
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-md w-[400px]">
          <Dialog.Title className="text-xl font-bold text-gray-200 mb-4">
            Create New Journey
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                {...register("name", { required: "Journey name is required" })}
                placeholder="Journey name"
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-200 hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
