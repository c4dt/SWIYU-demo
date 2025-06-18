# E-ID demo project
This project is a *Proof of Concept* representing an organization website that offers services
that are integrated with the swiss E-ID framework SWIYU. It provides issuer, and verifier examples.

## Features
1. A full issuer workflow integrated with the SWIYU infrastructure.
2. A full verifier workflow integrating with the SWIYU infrastructure. (In Progress)
3. A workflow that verifies an identity then issues another credential based on it. (Coming Soon) 

# Technical details

## Architecture ande technical Design
The project implements a custom web application, and uses the SWIYU open source services.
Namely it uses: 
- [eidch-issuer-agent-management](http://github.com/swiyu-admin-ch/eidch-issuer-agent-management)
- [eidch-issuer-agent-oid4vci](https://github.com/swiyu-admin-ch/eidch-issuer-agent-oid4vci)

The SWIYU issuer-agent-oidvci shares a Database with the other issuer-agent-management service.  
The management service is used internally by the organization to issue credentials, 
while the oid4vci service is the external point of contact for wallets that want to retrieve the proposed credentials.

An Nginx server is also used to interface the three services, and handle CORS appropriately,
and serve everything on port 80.

### A point on CORS
The SWIYU management service is designed to be only called through a `bussiness layer issuer` service. Which would 
contain the specific business logic for the organization. However, for the purpose of our PoC, we handle on the logic
on the frontend. For this, our Nginx configuration bypasses the CORS checks done by the browser and the backend.

## Dependencies
The major dependency of this project is `Docker` and `Docker Compose`.  
All other dependencies will be managed by docker.

## Setup
To set this project up, you will need to copy .env.sample -> .env and fill the variables.  
To get values for these variables, you will need to refer back to the SWIYU cookbook: 
[here](https://swiyu-admin-ch.github.io/cookbooks/onboarding-base-and-trust-registry/).

After setting things up, do: 

```sh
docker compose up
```
This will serve the frontend on port 80. However, this can be changed in the `nginx` service
in the `compose.yml` file.

## Using the app with a mobile wallet
Use the SWIYU mobile wallet. Get them from [here](https://swiyu-admin-ch.github.io/open-source-components/#swiyu-android--ios-app).

## Holder binding
TBD.

## API documentation
To see the API documentation of any of the SWIYU services, check the URI
`SERVICE_URL/swagger-ui/index.html`  
In this project, issuer management service would have this url for the documentation: `https://eid.c4dt.org/internal/issuer/swagger-ui/index.html`

You will also need another change which is to change the API documentation url
at the top of the page to `/internal/issuer/v3/api-docs/API`.  
In this case, `/internal/issuer/` is used as an example, and should be replaced with
the location of the desired service.
