
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CfnParameter, Stack } from "aws-cdk-lib";
import got from 'got/dist/source';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';


export class gitlab_token {

    // setup variables

    private request_url: any;
    private access_token: any;
    private api_response: any;
    private stack: Stack;


    // create constructor
    constructor(stack: Stack, request_url: any, access_token:any){
        this.request_url = request_url;
        this.access_token = access_token;
        this.stack = stack;

        this.api_response = this.getResponse();

    }


    
    // GET json fine from API request
    private getJson(): Promise<string[]> {
        // Attempt GET request using provided URL and Private Token
        return got(this.request_url, {
            method: 'GET',
            headers: {
                "Private-Token": this.access_token
            }
        }).json()
        .then(res => {
            // Return list of strings
            return res as string[]
        })
    }
    

    // Get API response
    private getResponse():any{

        // Setup Variables
        var search_string: any = "runners_token";
        
        // Get json file from API call
        this.getJson()
        .then(data => {
            // create SSM Parameter with gitlab runner token as the string
            const ssm_token = new StringParameter(this.stack, 'gitlab_runner_token', {
                parameterName: "/gitlab-runner/token",
                stringValue: data[search_string]
              });
        })
    }
}


