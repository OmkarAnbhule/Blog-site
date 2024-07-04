# InkWave Blogging Website

This blogging platform was created as part of my CodSoft internship. It is built using the MERN stack (MongoDB, Express.js, React, Node.js) and includes several key features to enhance the user experience.

## Features

- **User Authentication: Secure registration and login functionality.
- **Blog Post Creation: Users can easily create and publish blog posts.
- **Commenting System: Users can engage with posts through a robust commenting system.
- **Search Functionality: Built-in search feature to find specific posts.
- **Mobile-Friendly Design: Fully responsive and optimized for mobile devices.

## Technologies Used

- **Frontend**: React Vite (State Management)
- **Backend**: Node.js with Express
- **Database**: MongoDB (MongoDB Atlas for cloud hosting)
- **Authentication**: JWT (JSON Web Tokens)
- **UI Framework: Tailwind CSS

## Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/OmkarAnbhule/Blog-site.git
   
2. **Setup Frontend**
   ```bash
   cd client
   npm install

3. **Setup Backend**
   ```bash
   cd ../server
   npm install
   
4. **Configure Environment Variables**
   ```makefile
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Replace your_mongodb_uri, your_jwt_secret, your_cloudinary_* with your actual MongoDB URI, JWT secret, Cloudinary credentials respectively.

5. **Run Application**
   *Start Frontend*
     ```bash
     cd client
     npm run dev
  
  *Start Backend*
    ```bash
    cd ../server
    node index.cjs
    
7. **Access Application**
  Open your web browser and go to http://localhost:5173 to view the application.

## License
  This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
**React with Vite** - for building the frontend.
**Node.js with Express** - for building the backend API.
**MongoDB** - for database storage (MongoDB Atlas for cloud hosting).
**Cloudinary** - for media management and image uploads.
## Author
 - Omkar Suresh Anbhule
 - GitHub: https://github.com/OmkarAnbhule
 - Live Demo: https://blog-site-chi-pearl.vercel.app/
