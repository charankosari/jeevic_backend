import {
  ObjectCannedACL,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { config } from "../../config/env";

/**
 * Uploader class
 */
export class Uploader {
  private static _s3Client: S3Client;
  private static _s3Opts: { bucket: string };

  /**
   * Initialize the uploader
   * @param bucket Bucket name
   */
  constructor(bucket: string) {
    const options = {
      bucket,
    };
    Uploader._s3Opts = options;
    const s3ClientOpts: S3ClientConfig = {
      region: config.S3_REGION,
      endpoint: config.S3_ENDPOINT,
      credentials: {
        accessKeyId: config.S3_ACCESS_KEY,
        secretAccessKey: config.S3_SECRET_KEY,
      },
    };
    const client = new S3Client(s3ClientOpts);
    Uploader._s3Client = client;
  }

  /**
   * Upload a file to S3
   * @param folder_name Location to upload the file
   * @param file_name Name of the file
   * @param file File to upload
   * @param acl `public-read` or `private` access
   */
  async uploadFile(
    folder_name: string,
    file_name: string,
    file: File
    // acl: ObjectCannedACL
  ) {
    const parallelUploads3 = new Upload({
      client: Uploader._s3Client,
      params: {
        Bucket: Uploader._s3Opts.bucket,
        // ACL: acl,
        Body: file,
        Key: folder_name + "/" + file_name,
      },
    });

    await parallelUploads3.done();

    return `${config.S3_URL}/${folder_name}/${file_name}`;
  }
}
