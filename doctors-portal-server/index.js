const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb://localhost:27017`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l74gydh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  // console.log(`token inside verifyJWT`, req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: `unauthorized access` });
  }
  const token = authHeader.split(` `)[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: `forbidden access` });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const appointmentOptionsCollections = client
      .db("doctorsPortal")
      .collection("appointmentOptions");
    const bookingsCollections = client
      .db("doctorsPortal")
      .collection("bookings");
    const usersCollections = client.db("doctorsPortal").collection("users");

    app.get("/appointmentOptions", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const cursor = appointmentOptionsCollections.find(query);
      const option = await cursor.toArray();
      const bookingQuery = { appointmentDate: date };
      const alreadyBooked = await bookingsCollections
        .find(bookingQuery)
        .toArray();
      option.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.treatment === option.name
        );
        const bookedSlots = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        option.slots = remainingSlots;
        // console.log(date, option.name, remainingSlots.length);
      });
      res.send(option);
    });

    app.get("/v2/appointmentOptions", async (req, res) => {
      const date = req.query.date;
      const options = await appointmentOptionsCollections
        .aggregate([
          {
            $lookup: {
              from: "bookings",
              localField: "name",
              foreignField: "treatment",
              pipeLine: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$appointmentDate", date],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    slots: 1,
                    booked: {
                      $map: {
                        input: "$booked",
                        as: "book",
                        in: "$$book.slot",
                      },
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    slots: {
                      $setDifference: ["$slots", "$booked"],
                    },
                  },
                },
              ],
              as: "booked",
            },
          },
        ])
        .toArray();
      res.send(options);
    });

    app.get("/bookings", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      // console.log(`token`, req.headers.authorization);
      if (email !== decodedEmail) {
        return res.status(403).send({ message: `forbidden access` });
      }
      const query = { email: email };
      const bookings = await bookingsCollections.find(query).toArray();
      res.send(bookings);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      // console.log(booking);
      const query = {
        appointmentDate: booking.appointmentDate,
        email: booking.email,
        treatment: booking.treatment,
      };
      const alreadyBooked = await bookingsCollections.find(query).toArray();
      if (alreadyBooked.length) {
        const message = `You already have a booking on ${booking.appointmentDate}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollections.insertOne(booking);
      res.send(result);
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      // console.log(user);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        return res.send({ accessToken: token });
      }
      res.status(401).send({ accessToken: "unauthorized access" });
    });

    app.get("/allusers", async (req, res) => {
      const query = {};
      const users = await usersCollections.find(query).toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });

    app.get(`/allusers/admin/:email`, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollections.find(query).toArray();
      res.send({ isAdmin: user?.role === `admin` });
    });

    app.put(`/allusers/admin/:id`, verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await usersCollections.findOne(query);
      if (user?.role !== `admin`) {
        return res.status(403).send({ message: `forbidden access` });
      }

      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Doctors portal server is running!");
});

app.listen(port, () => {
  console.log(`Doctors portal server app listening on port ${port}`);
});
