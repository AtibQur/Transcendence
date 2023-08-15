# Transcendence

<img src="https://github.com/AtibQur/Transcendence/blob/main/Homepage.png" alt="Your image title" width="900"/>

## Table of Contents
* [Project Overview](#project-overview)
* [Tech Stack](#tech-stack)
* [Usage](#usage)
* [Docker Container Setup](#docker-container-setup)
* [Database](#database)
* [Features](#features)
* [Security](#security)
* [Contributors](#contributors)

## Project Overview

A single-page web application with real-time chat functionality

## Tech Stack

| Technology               | Description                                                                                                                                                                     |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **_TypeScript_**         | TypeScript enhances JavaScript by adding static typing and other features, helping us catch errors early and improve code quality.                                           |
| **_Docker_**             | Docker enables containerization, ensuring consistent deployment across different environments. It simplifies the setup process and improves scalability.                     |
| **_Socket.io_**          | Socket.io enables real-time, bidirectional communication between clients and the server. This technology fosters interactive features, enhancing user engagement and enabling instant updates. |
|                         |                                                                                                                                                                                 |
| **_NestJS_**             | A progressive Node.js framework that provides a solid architectural foundation for building efficient and scalable server-side applications.                                 |
| **_Prisma_**             | Prisma simplifies database access and management through its powerful ORM capabilities. It streamlines interactions with the PostgreSQL database, making data manipulation and retrieval efficient and intuitive. |
| **_PostgreSQL_**         | PostgreSQL serves as our relational database management system, offering robust data storage, retrieval, and management capabilities.                                      |
| **_Bcrypt_**             | Bcrypt is a widely used library for hashing passwords, ensuring that sensitive user data remains secure.                                                                     |
| **_Passport and JWT_**   | Passport is a versatile authentication middleware that supports various strategies, including JWT (JSON Web Token) authentication. JWT enhances security by securely transmitting information between parties.      |
|                         |                                                                                                                                                                                 |
| **_Vue_**                | Vue.js is a progressive JavaScript framework for building user interfaces. Its component-based architecture empowers us to create dynamic and responsive web applications. |
| **_PrimeVue_**           | PrimeVue offers a rich set of UI components that seamlessly integrate into Vue applications, enhancing the visual appeal and user experience.                               |
| **_Speakeasy and QR Code_** | Speakeasy facilitates two-factor authentication (2FA) implementation, adding an extra layer of security to user accounts. QR codes streamline the setup process for users, such as 2FA setup.                                        |
| **_Axios_**              | Axios simplifies HTTP requests, allowing smooth communication between the frontend and backend.                                                                           |


## Usage

To use philosophers, you must first clone this repository.

```console
git clone https://github.com/AtibQur/Transcendence.git
```

Once you have the source code, you can compile it using the provided Makefile.

```console
make
```

This will start tjdeployment of our project using Docker Compose. 

## Docker Container Setup

In our project, we've adopted a containerized approach using Docker to ensure consistent and portable deployment. We've set up three containers, each serving a distinct role:

**Backend Container:**

- This container hosts the backend of our application powered by NestJS.
- It's configured to run on port 3000 within the container.
  
**Frontend Container:**

- The frontend of our application, built with Vue.js, resides within this container.
- The container is configured to listen on port 8080.

**Database Container:**

- Our PostgreSQL database is contained within this Docker container.
- The container communicates via port 5432.

<img src="https://github.com/AtibQur/Transcendence/blob/main/Container.png" alt="Your image title" width="400"/>

## Database

## Features

## Security

## Contributors
