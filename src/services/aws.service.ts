import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import jobJSON from "./convert-job.json";
import { CreateJobResponse } from "aws-sdk/clients/mediaconvert";

export interface UploadResult {
  original_file_url: string;
  url: string;
  thumbnail_img: string;
}

@Injectable()
export class AwsService {
  get s3Bucket() {
    return new AWS.S3();
  };

  get mediaConvert() {
    return new AWS.MediaConvert({endpoint: process.env.AWS_MEDIACONVERT_ENDPOINT});
  };

  getMediaConvertJobParam = (videoUUID: string, role: string, s3Input: string, s3Output: string) => {
    const baseJobJson = JSON.parse(JSON.stringify(jobJSON));
    baseJobJson["UserMetadata"]["uuid"] = videoUUID;
    baseJobJson["Role"] = role;
    baseJobJson["Settings"]["OutputGroups"][0]["OutputGroupSettings"]["HlsGroupSettings"]["Destination"] = s3Output;
    baseJobJson["Settings"]["OutputGroups"][1]["OutputGroupSettings"]["FileGroupSettings"]["Destination"] = `${s3Output}`;
    baseJobJson["Settings"]["Inputs"][0]["FileInput"] = s3Input;
    return baseJobJson;
  };

  getDatabaseCredential(): Promise<any> {
    const client = new AWS.SecretsManager({
      region: process.env.AWS_REGION
    });
    return new Promise((resolve, reject) => {
      client.getSecretValue({ SecretId: process.env.AWS_DB_SECRET_ID }, (err, data) => {
        if (err) reject(err);
        if ("SecretString" in data) {
          const secret = data.SecretString;
          resolve(JSON.parse(secret));
        }
      });
    });
  }

  async fileUploadToS3(buffer: Buffer, videoUUID: string, ext: string): Promise<UploadResult> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `source/${videoUUID}${ext}`,
      Body: buffer
    };
    return new Promise((resolve, reject) => {
      const putObjectInS3 = this.s3Bucket.upload(params).promise();
      putObjectInS3.then((data) => {
        if (data == undefined) resolve(null);
        else resolve({
          original_file_url: `${process.env.AWS_VOD_BASE_URL}/source/${videoUUID}${ext}`,
          url: `${process.env.AWS_VOD_BASE_URL}/destination/${videoUUID}/${videoUUID}.m3u8`,
          thumbnail_img: `${process.env.AWS_VOD_BASE_URL}/destination/${videoUUID}/${videoUUID}.0000000.jpg`
        });
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  async createMediaConvertJob(videoUUID: string, ext: string): Promise<CreateJobResponse> {
    const params = this.getMediaConvertJobParam(
      videoUUID,
      process.env.AWS_MEDIACONVERT_ROLE,
      `s3://${process.env.AWS_S3_BUCKET_NAME}/source/${videoUUID}${ext}`,
      `s3://${process.env.AWS_S3_BUCKET_NAME}/destination/${videoUUID}/`
    );

    return new Promise<CreateJobResponse>((resolve, reject) => {
      this.mediaConvert.createJob(params, (err, data) => {
        if (err) reject(err); // an error occurred
        else {
          resolve(data)
        }           // successful response
      });
    });
  }
}
