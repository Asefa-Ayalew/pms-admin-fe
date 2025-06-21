import { ComboboxItem, OptionsFilter } from "@mantine/core";

//  const optionsFilter: OptionsFilter = ({ options, search }) => {
//     const filtered = (options as ComboboxItem[]).filter((option) =>
//       option?.label?.toLowerCase()?.trim()?.includes(search?.toLowerCase()?.trim())
//     );
const optionsFilter: OptionsFilter = ({ options, search }) => {
  const filtered = (options as ComboboxItem[]).filter((option) => {
    const label = option?.label?.toLowerCase()?.trim(); // Add null checks
    const searchTerm = search?.toLowerCase()?.trim(); // Add null checks
    // check if there is a search string
    if (search) {
      return label && searchTerm && label.includes(searchTerm); // Check if label and searchTerm are not null or undefined
    }
    return true;
  });

  filtered?.sort((a, b) => a?.label?.localeCompare?.(b?.label));
  return filtered;
};

export default optionsFilter;
