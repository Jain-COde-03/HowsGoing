const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "John Doe",
        email: "john@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "John Doe",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Guest User",
        email: "guest@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Anthony",
        email: "anthony@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Anthony",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "jon@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Friends",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Jane Doe",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "jon@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Chill Zone",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
];

module.exports = { chats };

// [
//   {
//     firstName: "Aarav",
//     lastName: "Sharma",
//     fullName: "Aarav Sharma",
//     dateOfBirth: "15/01/2005",
//   },
//   {
//     firstName: "Vivaan",
//     lastName: "Verma",
//     fullName: "Vivaan Verma",
//     dateOfBirth: "20/02/2006",
//   },
//   {
//     firstName: "Aditya",
//     lastName: "Singh",
//     fullName: "Aditya Singh",
//     dateOfBirth: "18/03/2007",
//   },
//   {
//     firstName: "Ishita",
//     lastName: "Gupta",
//     fullName: "Ishita Gupta",
//     dateOfBirth: "25/04/2008",
//   },
//   {
//     firstName: "Ananya",
//     lastName: "Mehta",
//     fullName: "Ananya Mehta",
//     dateOfBirth: "30/05/2005",
//   },
//   {
//     firstName: "Rohan",
//     lastName: "Patel",
//     fullName: "Rohan Patel",
//     dateOfBirth: "12/06/2006",
//   },
//   {
//     firstName: "Priya",
//     lastName: "Reddy",
//     fullName: "Priya Reddy",
//     dateOfBirth: "08/07/2007",
//   },
//   {
//     firstName: "Karan",
//     lastName: "Kapoor",
//     fullName: "Karan Kapoor",
//     dateOfBirth: "22/08/2008",
//   },
//   {
//     firstName: "Sneha",
//     lastName: "Nair",
//     fullName: "Sneha Nair",
//     dateOfBirth: "14/09/2005",
//   },
//   {
//     firstName: "Arjun",
//     lastName: "Das",
//     fullName: "Arjun Das",
//     dateOfBirth: "09/10/2006",
//   },

//   {
//     firstName: "Rahul",
//     lastName: "Yadav",
//     fullName: "Rahul Yadav",
//     dateOfBirth: "11/11/2007",
//   },
//   {
//     firstName: "Neha",
//     lastName: "Joshi",
//     fullName: "Neha Joshi",
//     dateOfBirth: "03/12/2008",
//   },
//   {
//     firstName: "Siddharth",
//     lastName: "Mishra",
//     fullName: "Siddharth Mishra",
//     dateOfBirth: "27/01/2005",
//   },
//   {
//     firstName: "Pooja",
//     lastName: "Chauhan",
//     fullName: "Pooja Chauhan",
//     dateOfBirth: "14/02/2006",
//   },
//   {
//     firstName: "Amit",
//     lastName: "Agarwal",
//     fullName: "Amit Agarwal",
//     dateOfBirth: "05/03/2007",
//   },
//   {
//     firstName: "Nikita",
//     lastName: "Bansal",
//     fullName: "Nikita Bansal",
//     dateOfBirth: "19/04/2008",
//   },
//   {
//     firstName: "Manish",
//     lastName: "Saxena",
//     fullName: "Manish Saxena",
//     dateOfBirth: "23/05/2005",
//   },
//   {
//     firstName: "Kavya",
//     lastName: "Iyer",
//     fullName: "Kavya Iyer",
//     dateOfBirth: "30/06/2006",
//   },
//   {
//     firstName: "Deepak",
//     lastName: "Pandey",
//     fullName: "Deepak Pandey",
//     dateOfBirth: "17/07/2007",
//   },
//   {
//     firstName: "Ritika",
//     lastName: "Malhotra",
//     fullName: "Ritika Malhotra",
//     dateOfBirth: "06/08/2008",
//   },

//   {
//     firstName: "Harsh",
//     lastName: "Thakur",
//     fullName: "Harsh Thakur",
//     dateOfBirth: "28/09/2005",
//   },
//   {
//     firstName: "Simran",
//     lastName: "Kaur",
//     fullName: "Simran Kaur",
//     dateOfBirth: "15/10/2006",
//   },
//   {
//     firstName: "Gaurav",
//     lastName: "Kulkarni",
//     fullName: "Gaurav Kulkarni",
//     dateOfBirth: "22/11/2007",
//   },
//   {
//     firstName: "Meera",
//     lastName: "Pillai",
//     fullName: "Meera Pillai",
//     dateOfBirth: "10/12/2008",
//   },
//   {
//     firstName: "Vikas",
//     lastName: "Choudhary",
//     fullName: "Vikas Choudhary",
//     dateOfBirth: "09/01/2005",
//   },
//   {
//     firstName: "Tanvi",
//     lastName: "Deshmukh",
//     fullName: "Tanvi Deshmukh",
//     dateOfBirth: "26/02/2006",
//   },
//   {
//     firstName: "Ajay",
//     lastName: "Tripathi",
//     fullName: "Ajay Tripathi",
//     dateOfBirth: "13/03/2007",
//   },
//   {
//     firstName: "Shreya",
//     lastName: "Bhattacharya",
//     fullName: "Shreya Bhattacharya",
//     dateOfBirth: "02/04/2008",
//   },
//   {
//     firstName: "Naveen",
//     lastName: "Shetty",
//     fullName: "Naveen Shetty",
//     dateOfBirth: "18/05/2005",
//   },
//   {
//     firstName: "Divya",
//     lastName: "Rao",
//     fullName: "Divya Rao",
//     dateOfBirth: "07/06/2006",
//   },
// ];
