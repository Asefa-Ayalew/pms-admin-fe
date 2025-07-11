"use client";
import { Box, Button } from "@mantine/core";
import { formatDate } from "@/src/shared/utils/date-utils";
import { Room } from "@/src/models/room.model";

interface Props {
  onClose: () => void;
  data?: Room;
}

export default function RoomPreview(props: Props) {
  return (
    <Box className="w-full text-sm text-gray-900">
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Description"}
        </td>
        <td className="p-2">{props?.data?.description}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Size"}
        </td>
        <td className="p-2">{props.data?.size}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Floor Number"}
        </td>
        <td className="p-2">{props.data?.floorNumber}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"Room Number"}
        </td>
        <td className="p-2">{props.data?.roomNumber}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
          {"No of Bed Rooms"}
        </td>
        <td className="p-2">{props.data?.numberOfBedRooms}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Is Public"}</td>
        <td className="p-2">{props.data?.makePublic ? "Yes" : "No"}</td>
      </tr>
      <Box className="flex justify-end mt-2">
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
