export const TESTIMONIAL_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/get-testimonials`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/create-testimonial`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/get-testimonial`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/update-testimonial`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/delete-testimonial`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/archive-testimonial`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/testimonials/restore-testimonial`,
};
