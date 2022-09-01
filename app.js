const express = require("express");
const { Sequelize, DataTypes } = require("sequelize")

// coneccion a la base de datos
const db = new Sequelize({ 
  dialect: "postgres", // se conecta a postgres
  host: "localhost",
  username: "postgres", // conecta a cuenta administrador
  password: "Emma2015", // contraseña de postgres
  port: 5432,
  database: "blogs",
  logging: false,
})

//definir modelo de base de dato
const User = db.define ("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // por default false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // no se puede repetir el correo
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active"
  },
})

db.authenticate()
.then(() => console.log("database authenticaded"))
.catch(err => console.log(err))

//sincroniza y crea la tabla si todavia no existe.
db.sync()
.then(() => console.log("Database synced"))
.catch(err => console.log(err))

// inicio express
const app = express();
// usa datos json
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

      
    const newUser = await User.create({ name, email, password });
  
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  }  catch (error){
    console.log(error);
  }
});

// cath non existing endpoints.
app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `${req.method} ${res.url} does not exists in our server`
    });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log("express app running!");
});
