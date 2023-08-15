# Transcendence

<img src="https://github.com/AtibQur/Transcendence/blob/main/Homepage.png" alt="HomePage" width="900"/>

## Table of Contents
* [Project Overview](#project-overview)
* [Tech Stack](#tech-stack)
* [Usage](#usage)
* [Docker Container Setup](#docker-container-setup)
* [Database](#database-schema)
* [User Account](#user-account)
* [Chat](#chat)
* [Game](#game)
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

To use our application, you must first clone this repository.

```console
git clone https://github.com/AtibQur/Transcendence.git
```

Once you have the source code, you can compile it using the provided Makefile.

```console
make
```

This will start the deployment of our project using Docker Compose. 

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

## Database Schema

<img src="https://github.com/AtibQur/Transcendence/blob/main/Database.png" alt="DatabaseSchema" width="900"/>

## User Account

- **Secure Login:** Seamlessly log in through OAuth using the 42 intranet, ensuring both accessibility and account security.

- **Customization:** Personalize your identity by choosing your own username and avatar, visible across the website.

- **Two-Factor Authentication:** Strengthen account security with options like Google Authenticator or SMS verification.

- **Friend Connections:** Add other users as friends to stay informed about their online status, gaming activities, and interactions.

- **Stats and Achievements:** Showcase your gaming prowess with detailed stats, wins, losses, ladder levels, and achievements displayed on your profile.

- **Match History:** Relive your gaming journey through an extensive Match History, encompassing 1v1 games, ladder matches, and more.

## Chat

- **Channel Creation:** Create public, private, or password-protected chat rooms tailored to your preferences.

- **Direct Messaging:** Establish one-on-one connections with fellow gamers through direct messaging.

- **User Blocking:** Exercise control over your interactions by blocking users, ensuring a focused and comfortable environment.

- **Channel Ownership:** Initiate channels and become the automatic owner, with the ability to set, change, and manage passwords.

- **Channel Administration:** Channel owners can designate administrators, empowering them to maintain a respectful atmosphere and regulate user activities.

- **Invitations and Profiles:** Seamlessly send game invitations and access player profiles for a comprehensive understanding of your fellow gamers.

## Game

- **Real-time game:** Engage in real-time Pong matches, bringing the classic game to life through seamless online play.

- **Matchmaking:** Experience fair and exciting matchups through our automated matchmaking system. Join a queue and get paired with opponents for competitive Pong action.

## Security

## Contributors
