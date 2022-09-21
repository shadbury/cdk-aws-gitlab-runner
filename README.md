# GitLab Runner

## Description

This module creates a shared gitlab runner.

The module requires two parameters:  ```url``` and ```private_token```.

These parameters are required as they are used to make an api get request to the url specified.

for exampe - to setup a runner for this repo, we need the token to register a runner for this module.

to get this, we start a GET API request: 

```
https://gitlab.runcmd.cmdsolutions.com.au/api/v4/projects/1552/ 
```

and we add the ```private_token``` to the header in the request:

```
"Private-Token": private_token
```

This then creats an ssm paremeter in the clients account to be used by the userdata script in the launch template.


## Parameters

```url``` - Used for the api get request.

```private_token``` - Used in the header of the api get request

## Deployment Example

### bootstrap

cdk bootstrap --profile ```<aws profile>```

### deploy

 URL=https://gitlab.com/api/v4/projects/39555473/ PRIVATE_TOKEN=Enter Token cdk deploy --profile example-nonprod


