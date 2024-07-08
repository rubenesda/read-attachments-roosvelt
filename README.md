# Overview
This is a small Nestjs project that reads an email only JSON attachments under these instructions https://support.google.com/mail/answer/9261412?hl=en. There is an endpoint that receives the path of an email file. Finally, it returns the JSON files attached in the email in any of the following cases:
- as a file attachment
- inside the body of the email as a link

# Technologies supported
- NestJS v10
- Mailparser v3
- NodeJS v20

# Installation

```bash
$ yarn install
```

# Getting Started

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

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
