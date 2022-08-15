# Assemble Images

AWS Lambda Function to upload [Assemble Scrapbook](https://github.com/hackclub/assemble-scrapbook) images to S3.

Originally, Assemble Scrapbook used [Hack Club CDN](https://github.com/hackclub/cdn) to host images. However, with frequent uploads, we ran into a race condition that caused concurrent uploads to Hack Club CDN to fail.

https://github.com/hackclub/assemble-scrapbook/pull/18

### Development

`npm run build`, upload the resulting output.zip to AWS.
