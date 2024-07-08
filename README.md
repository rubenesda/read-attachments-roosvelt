# Overview
This is a small Nestjs project that reads an email only JSON attachments under these instructions https://support.google.com/mail/answer/9261412?hl=en. There is an endpoint that receives the path of an email file. Finally, it returns the JSON files attached in the email in any of the following cases:
- as a file attachment
- inside the body of the email as a link

# Requirements
- NodeJS 20.11.0
- Postman

# Technologies supported
- NestJS v10
- Mailparser v3

# Installation

```bash
$ yarn install
```

# Getting Started

## Running the app

This small NestJS server will run from `http://localhost:3000`

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Make the request

An endpoint called `/mail` was created to reads the attachments from an email file. It provides a curl command that you can use on Postman for executing the resquest to this NestJS server as follow:

```bash
curl --location --request POST 'http://localhost:3000/mail?url=path/to/filename.eml'
```

You can import it on Postman and execute it as your own request from there. Now, `url` will be the location of your email file stored in your local machine. You'll be able to replace `path/to/filename.eml` with the whole path of your email file stored in your local machine.

Remember, this endpoint needs `POST` method and this doesn't need a body request.

## Examples

It provides some email files as example that you can download to local machine. You can find them in `examples` directory from the root of this project.

- example_email_1.eml: it has no attachments in the email
- example_email_2.eml: it has one JSON file attached in the email.
- example_email_3.eml: it has one JSON file attached as link in the body of the email.
- example_email_4.eml: it has two JSON files attached as links in the body of the email.

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# License

Nest is [MIT licensed](LICENSE).
