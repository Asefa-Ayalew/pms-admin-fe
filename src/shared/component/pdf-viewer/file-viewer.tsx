"use client";
import { Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
export const FileViewer = ({
  url,
  filename,
  type,
}: {
  url: string;
  filename: string;
  type: string;
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [excelData, setExcelData] = useState<unknown[] | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log(opened, close, fileContent);
  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error fetching file");
        }
        const fileBlob = await response.blob();
        const blobType = fileBlob.type;

        // Check if the blob is an image or a PDF
        if (type.includes("image")) {
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileContent(fileUrl);
        } else if (blobType.includes("pdf")) {
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                  resolve(reader.result);
                } else {
                  reject(new Error("Failed to convert Blob to ArrayBuffer"));
                }
              };
              reader.onerror = () => {
                reject(new Error("Error reading Blob as ArrayBuffer"));
              };
              reader.readAsArrayBuffer(fileBlob);
            }
          );
          setPdfData(arrayBuffer);
        } else if (blobType.includes("octet-stream")) {
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                  resolve(reader.result);
                } else {
                  reject(new Error("Failed to convert Blob to ArrayBuffer"));
                }
              };
              reader.onerror = () => {
                reject(new Error("Error reading Blob as ArrayBuffer"));
              };
              reader.readAsArrayBuffer(fileBlob);
            }
          );
          setPdfData(arrayBuffer);
        } else if (
          blobType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const excelJson = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          setExcelData(excelJson);
        }
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    getFile();
  }, [url]);

  if (error) {
    return (
      <div>
        <p className="text-center py-2 text-md">{`
    It appears that something went wrong when loading the file.
    Double-check your connection and try reloading.
`}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ height: "500px" }}
      >
        {pdfData ? (
          <iframe
            src={`data:application/pdf;base64,${Buffer.from(pdfData).toString(
              "base64"
            )}`}
            width="100%"
            height="100%"
            title={filename}
          />
        ) : type.includes("image") ? (
          <Image
            src={url}
            alt={filename}
            className="cursor-pointer "
            onClick={() => open()}
            loading="lazy"
          />
        ) : excelData ? (
          <table>
            <tbody>
              {excelData.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Opening...</p>
        )}
      </div>
    </>
  );
};
