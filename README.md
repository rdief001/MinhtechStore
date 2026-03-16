
MinhtechStore
Training website used for cybersecurity awareness and phishing detection demonstrations.
This project simulates a commercial storefront environment for educational purposes.

Requirements

Install the following before running the project:
• Node.js (v18 or newer recommended)
• npm (comes with Node.js)
• Git

Check versions in terminal:
node -v
npm -v
git --version


Setup Instructions
1. Clone the repository
git clone https://github.com/rdief001/MinhtechStore.git
cd MinhtechStore


2. Install dependencies
npm install

This installs all packages listed in package.json.
Running the Website (Development)

Start the development server:
npm run dev

Open in browser:
http://localhost:5173

The server will automatically reload when files are edited.
Build for Production

To create optimized production files:
npm run build

Production files will appear in:
/dist

Preview Production Build
To run the built version locally:

npm run preview
Updating the Project

If new updates are pushed to the repository:

git pull
npm install
npm run dev


Notes

This project is intended for controlled training environments.
Do not deploy publicly without proper authorization.



