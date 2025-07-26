export const FAQ_ENDPOINT = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/faqs/get-faqs`,
  listArchivedFAQs: `${process.env.NEXT_PUBLIC_APP_API}/faqs/get-archived-faqs`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/faqs/create-faq`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/faqs/get-faq`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/faqs/update-faq`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/faqs/delete-faq`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/faqs/archive-faq`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/faqs/restore-faq`,
};
