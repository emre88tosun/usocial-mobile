# uSocial - React Native Application

**uSocial** is a mobile platform that enables influencers to connect with their audience through a gem-based messaging system. This application is meticulously crafted using **React Native** to deliver a seamless and engaging user experience.

## Features

- **Influencer Profiles**: Browse and interact with detailed influencer profiles.
- **Gem Transactions**: Securely purchase and manage gems via Stripe integration.
- **Direct Messaging**: Communicate directly with influencers using gems.
- **Real-Time Chat**: Experience instant messaging powered by CometChat.
- **Secure Authentication**: Robust user authentication managed by Laravel Sanctum.

## Technology Stack

- **React Native**: Framework for building cross-platform mobile applications.
- **TypeScript**: Ensures type safety and enhances code maintainability.
- **Expo SDK**: Facilitates development and deployment processes.
- **Expo Router**: Simplifies navigation within the application.
- **Tailwind CSS**: Provides utility-first styling for rapid UI development.
- **Zustand**: Lightweight state management solution.
- **React Query**: Efficient data fetching and state synchronization.
- **Axios**: Promise-based HTTP client for API interactions.
- **React Hook Form & Zod**: Streamlined form handling with schema validation.

## Prerequisites

Ensure the following are installed on your development environment:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) and/or [Xcode](https://developer.apple.com/xcode/) for device emulation.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/emre88tosun/usocial-mobile.git
   cd usocial-mobile
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Development Environment**:

   ```bash
   npm run ios / npm run android
   ```

## API Integration

The application communicates with a Laravel-based backend API. Ensure that the backend service is operational and accessible at the URL specified in the `API_URL` environment variable.
