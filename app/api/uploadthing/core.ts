import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: '4MB' } }).onUploadComplete(
    async ({ metadata, file }) => {}
  ),

  variantUploader: f({
    image: { maxFileCount: 10, maxFileSize: '4MB' },
  })
    .onUploadError(async ({ error }) => {
      console.log('error: ', error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('file:', file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
