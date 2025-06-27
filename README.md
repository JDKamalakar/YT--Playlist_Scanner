# YouTube Playlist Analyser & Deleted Video Finder
This project provides a powerful tool to analyze your YouTube playlists, gain insights into your video content, and identify any videos that have been deleted or made private. Keep your playlists clean and know exactly what's missing!

✨ Features
Playlist Analysis:

Get statistics on your playlists, such as total video count, total duration, and average video length.

Categorize videos by their privacy status (public, private, unlisted).

(Optional future feature): Analyze video view counts, likes, comments (requires broader API scope).

Deleted/Private Video Finder:

Scan your playlists to detect videos that are no longer publicly available (deleted, private, or unlisted).

Generate a clear list of missing or inaccessible videos, including their original title (if available) and the reason for unavailability.

User-Friendly Web Interface:

Easy input for playlist URLs or IDs via a web form.

Clear and organized output for analysis results and deleted video lists displayed directly in the browser.

🚀 Technologies Used
This project is primarily built using:

TypeScript: The primary language for building a robust and modern frontend user interface (87.2%).

React: A JavaScript library for building dynamic and responsive user interfaces.

CSS: For structuring and styling the web application, including a clean and modern design (6.7%).

JavaScript: Used alongside TypeScript for various functionalities and compatibility (5.7%).

HTML: The foundational markup language for the web application (0.4%).

YouTube Data API: For fetching playlist and video information.

⚙️ Setup and Installation
To run this project locally, you will need to set up the necessary dependencies and obtain a YouTube Data API key.

Clone the repository:

git clone https://github.com/your-username/youtube-playlist-analyzer.git

cd youtube-playlist-analyzer

Install Node.js dependencies:
It's recommended to use a package manager like npm or yarn.

npm install
# or
yarn install

Obtain a YouTube Data API Key:

Go to the Google Cloud Console.

Create a new project (or select an existing one).

Navigate to "APIs & Services" > "Dashboard".

Click "+ Enable APIs and Services" and search for "YouTube Data API v3". Enable it.

Go to "Credentials" and click "Create Credentials" > "API Key".

Copy your API Key. Keep this key secure and do not commit it directly to your repository!

Configure your API Key:
For a web application, it's crucial to handle your API key securely. Do not embed your API key directly in client-side code (HTML, CSS, JS/TS files that are served to the browser) as it will be publicly exposed.

A common secure approach is to:

Use a backend proxy: Set up a simple server-side endpoint (e.g., using Node.js/Express, Python/Flask, or similar) that makes the YouTube API calls on behalf of the client. Your client-side code then calls this backend endpoint, and your API key is safely stored on the server.

Use environment variables for the backend: When deploying your backend proxy, store the YOUTUBE_API_KEY as an environment variable on your server.

For local development, you might add it to a .env file in the root of your frontend project, but remember this is for development only and should not be deployed directly to a production client-side environment.

# Example .env.local (for local frontend development with a proxy or secure build process)
REACT_APP_YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"

Ensure your frontend code reads this environment variable during the build process and is configured to make requests to your backend proxy.

Run the application:

npm start
# or
yarn start

This will open the application in your browser, usually at http://localhost:3000.

🖥️ Usage
Prepare your playlist ID(s) or URL(s).

Access the web application in your browser.

Enter the playlist ID(s) or URL(s) into the provided input field.

Initiate the analysis. The application will then fetch playlist details and video information using the YouTube Data API.

Review the output. The analysis results and a list of deleted/private videos will be displayed directly on the web page.

🤝 Contributing
Contributions are warmly welcome! If you have ideas for improvements, new features, or bug fixes, please consider:

Forking the repository.

Creating a new branch (git checkout -b feature/your-feature-name).

Making your changes and ensuring tests pass.

Commit your changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request with a clear description of your changes.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Disclaimer: This tool relies on the YouTube Data API and its terms of service. Excessive use might lead to quota limits.
