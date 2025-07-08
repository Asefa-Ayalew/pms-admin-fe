"use client";
import { Box, Button } from "@mantine/core";
import { formatDate } from "@/src/shared/utils/date-utils";
import { RoomService } from "@/src/models/room.model";
import { useParams } from "next/navigation";

interface Props {
  onClose: () => void;
  data?: RoomService;
}

export default function ServicePreview(props: Props) {
  const params = useParams();
  return (
    <Box className="w-full text-sm text-gray-900">
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Charge Amount"}
        </td>
        <td className="p-2">{props?.data?.chargeAmount}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Available From"}
        </td>
        <td className="p-2">{formatDate(props.data?.availableFrom)}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Is Optional"}
        </td>
        <td className="p-2">{props.data?.isOptional ? "Yes" : "No"}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Is Public"}</td>
        <td className="p-2">{props.data?.isPublic ? "Yes" : "No"}</td>
      </tr>
      <Box className="w-full justify-end mt-4">
        <Button
          variant="filled"
          bg={"primary.4"}
          type="button"
          onClick={() => props.onClose()}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
}
