export const FEEDBACK_ENDPOINT = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/get-feedbacks`,
  listArchivedFeedbacks: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/get-archived-feedbacks`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/create-feedback`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/get-feedback`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/update-feedback`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/delete-feedback`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/archive-feedback`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/feedbacks/restore-feedback`,
};
