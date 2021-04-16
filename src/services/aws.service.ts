import {Injectable} from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class AwsService {
  getDatabaseCredential(): Promise<any> {
    const client = new AWS.SecretsManager({
      region: 'ap-northeast-2'
    });
    return new Promise((resolve, reject) => {
      client.getSecretValue({SecretId: 'dev-octank-rds'}, (err, data) => {
        if (err) reject(err);
        if ("SecretString" in data) {
          const secret = data.SecretString;
          resolve(JSON.parse(secret));
        }
      });
    });
  }
}
