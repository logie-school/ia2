const axios = require("axios");

const users = [
  {
    email: "mtayl137@eq.edu.au",
    password: "Password123!",
    fn: "Martin",
    mn: null,
    sn: "Taylor",
  },
  {
    email: "jbuma0@eq.edu.au",
    password: "Password123!",
    fn: "Jordan",
    mn: null,
    sn: "Buma",
  },
  {
    email: "dpeet3@eq.edu.au",
    password: "Password123!",
    fn: "Dianne",
    mn: null,
    sn: "Peters",
  },
  {
    email: "dmann24@eq.edu.au",
    password: "Password123!",
    fn: "Dave",
    mn: null,
    sn: "Mannion",
  },
  {
    email: "aswan26@eq.edu.au",
    password: "Password123!",
    fn: "Anthony",
    mn: null,
    sn: "Swan",
  },
  {
    email: "khutt11@eq.edu.au",
    password: "Password123!",
    fn: "Kevin",
    mn: null,
    sn: "Hutton",
  },
];

const registerUsers = async () => {
  for (const user of users) {
    try {
      const response = await axios.post("http://localhost:3000/api/register", user);
      console.log(`User ${user.email} registered successfully:`, response.data);
    } catch (error) {
      console.error(`Error registering user ${user.email}:`, error.response?.data || error.message);
    }
  }
};

registerUsers();