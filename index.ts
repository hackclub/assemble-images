/*
  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 300;

// Main Lambda entry point
exports.handler = async (event) => {
  return await getUploadURL(event);
};

const getUploadURL = async function (event) {
  const parsedBody = JSON.parse(event.body);

  const fileName = parsedBody.fileName;
  const contentType = parsedBody.contentType;

  const Key = `${uuidv4()}-${fileName}`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: 'assemble-images',
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: contentType
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
  },
    body: JSON.stringify({
      uploadURL: uploadURL,
      fileURL: `https://assemble-images.hackclub.com/${Key}`,
    })
  };
};
