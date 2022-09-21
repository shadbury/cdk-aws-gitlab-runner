import { Stack } from "aws-cdk-lib";
import { AutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import *  as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { readFileSync } from "fs";
import { join } from "path";

export class autoscaling_group{

    // initialize variables
    private stack: Stack;



    // create object
    constructor(stack: Stack){
        this.stack = stack;

        // initialize self
        this.initialize();
    }


    // Call Create ASG
    initialize(){
        this.create_asg();
    }


    // Create ASG
    private create_asg(){


        // Create VPC for runner
        const vpc = new ec2.Vpc(this.stack, 'Runner_VPC', {
            cidr: "10.59.59.0/24"
         })


         // Create SG for runner
        const sg = new ec2.SecurityGroup(this.stack, "Gitlab_Runner_SG", {
            vpc:vpc,
            allowAllOutbound: true,
            securityGroupName: "gitlab_runner_sg"
        });


        // Create role for runner
        const instanceRole = new iam.Role(this.stack, 'Role', {
            roleName: "gitlab_runner_role",
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            description: 'gitlab runner role',
          });

          instanceRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                "sts:AssumeRole"
            ],
            resources: [
                "*"
            ]
        }));

        instanceRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                "ec2:ModifyInstanceMetadataOptions",
                "ecr:GetAuthorizationToken",
                "route53:ListHostedZonesByName",
                "route53:ChangeResourceRecordSets",
                "route53:GetHostedZone",
                "route53:ListResourceRecordSets"
            ],
            resources: [
                "*"
            ]
        }));

        instanceRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                "ssm:GetParameters",
                "ssm:GetParameter",
                "kms:Decrypt",
                "ssm:PutParameter",

            ],
            resources: [
                "*"
            ]
        }));


    
        // Create userdate template
        const userdata = ec2.UserData.forLinux();
        userdata.addCommands(this.readTemplate("./userdata.tpl"));

          const linux = new ec2.GenericLinuxImage({
            'ap-southeast-2': 'ami-029517bdb38391983',
          });


          // create launch template
        const template = new ec2.LaunchTemplate(this.stack, 'gitlab_asg_template', {
            launchTemplateName: "gitlab_shared_runner",
            role: instanceRole,
            userData: userdata,
            machineImage: linux,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
            securityGroup: sg
          });


          // create ASG
        const asg = new AutoScalingGroup(this.stack, 'Runner_ASG', {
            autoScalingGroupName: "gitlab_runner",
            vpc,
            launchTemplate: template
          });
    }

    private readTemplate(filename:string){
        const result = readFileSync(join(__dirname, filename), 'utf-8');
        return result;
    }
}