export const propertyEndpoint = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/properties/get-properties`,
  listArchivedProperties: `${process.env.NEXT_PUBLIC_APP_API}/properties/get-archived-properties`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/properties/create-property`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/properties/get-property`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/properties/update-property`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/properties/delete-property`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/properties/archive-property`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/properties/restore-property`,

  addGallery: `${process.env.NEXT_PUBLIC_APP_API}/properties/add-property-gallery`,
  updateGallery: `${process.env.NEXT_PUBLIC_APP_API}/properties/update-property-gallery`,
  removeGallery: `${process.env.NEXT_PUBLIC_APP_API}/properties/remove-property-gallery`,
};
