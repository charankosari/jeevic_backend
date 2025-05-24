import { Uploader } from "../libs/s3/upload";
import { config } from "../config/env";

const uploaderService = new Uploader(config.S3_BUCKET);

export class UploaderService {
  public static readonly upload = async (file: File) => {
    const trimmedName = file.name.trim(); 
    const newName = Date.now() + "-" + trimmedName;
    const url = await uploaderService.uploadFile("jv-uploads", newName, file);
    return {
      url,
    };
  };
}
