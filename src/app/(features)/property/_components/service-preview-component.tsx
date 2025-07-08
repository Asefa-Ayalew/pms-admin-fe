"use client";
import { Box, Button } from "@mantine/core";
import { formatDate } from "@/src/shared/utils/date-utils";
import { PropertyService } from "@/src/models/property.model";

interface Props {
  onClose: () => void;
  data?: PropertyService;
}

export default function ServicePreview(props: Props) {
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
        <td className="p-2">{props.data?.isOptional}</td>
      </tr>
      <tr className="flex border-b border-gray-300 border-dashed">
        <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Is Public"}</td>
        <td className="p-2">{props.data?.isPublic ? "Yes" : "No"}</td>
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
