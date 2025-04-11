import { useState } from "react";
import { Journey } from "../api/journeys";
import { timeAgo } from "../utils/timeAgo";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RenameJourneyDialog } from "./RenameJourneyDialog";
import { updateJourney, deleteJourney } from "../api/journeys";
import { useInvalidateQueries } from "../hooks/useInvalidateQueries";
import { MoreVertical } from "../icons/MoreVertical";
import { Link } from "react-router-dom";

interface JourneyListItemProps {
  journey: Journey;
}

export function JourneyListItem({ journey }: JourneyListItemProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const { invalidateJourneys } = useInvalidateQueries();

  const handleRename = async (name: string) => {
    await updateJourney(journey.id, name);
    invalidateJourneys();
  };

  const handleDelete = async () => {
    await deleteJourney(journey.id);
    invalidateJourneys();
  };

  return (
    <>
      <li className="p-4 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 text-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <Link
              to={`/journeys/${journey.id}`}
              className="font-medium hover:text-blue-400"
            >
              {journey.name}
            </Link>
            <span className="text-sm text-gray-400 ml-2">
              {timeAgo(journey.createdAt)}
            </span>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded-md">
                <MoreVertical />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-gray-800 rounded-md p-1 shadow-lg border border-gray-700"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="text-gray-200 text-sm px-2 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
                  onSelect={() => setRenameOpen(true)}
                >
                  Rename
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="text-red-400 text-sm px-2 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
                  onSelect={handleDelete}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </li>
      <RenameJourneyDialog
        journey={journey}
        onRename={handleRename}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
    </>
  );
}
