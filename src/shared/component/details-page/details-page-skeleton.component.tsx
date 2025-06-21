import { Skeleton, Table } from "@mantine/core";
import { JSX } from "react";

interface Props {
  showProfile: boolean;
  widthClass?: string;
}

export default function DetailsPageSkeleton(props: Props): JSX.Element {
  const { showProfile, widthClass = "max-w-2xl" } = props;

  return (
    <div className={`mx-auto ${widthClass}`}>
      {showProfile && (
        <section className="flex gap-2 bg-gray-100 p-4 rounded-sm">
          <Skeleton height={96} circle />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </section>
      )}
      <section className="mt-8 last:mb-0">
        <Skeleton />
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[...new Array(5)].map((_, index) => (
              <Table.Tr key={index + 1}>
                <Table.Td>
                  <Skeleton />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </section>
    </div>
  );
}
