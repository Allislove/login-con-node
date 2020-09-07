const fs = require('fs');  
//importo ahora express , es de nodejs: es filesystem
const express = require('express');
const app = express(); 
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
/* middlewares */
app.use(express.static('assets')); // Generamos la direccion en donde estaran las rutas estaticas, puedo tener mas de una direccion estatica
app.use(express.json())







/*  Manejo solo la solicitud en especifico en la ruta /nosotros  asi es un middleware con tres args*/
app.use('/nosotros', function (req, res, next) {
  console.log('Request Type:', req.method);
  fs.readFile('./assets/contador.txt', (error, data) => {
      if(error) {
          return console.log("No se encontro el archivo")
      }
      let visitas = data.toString().split(":")[1];
      visitas++;
    //console.log(visitas)
  
      fs.writeFile('./assets/contador.txt', `visitas: ${visitas}`, (error) => {
        if(error) {
          console.log(error);
        }
        res.send('<h1> El contador de visita va en :'+visitas + '</h1>')
      });
  next()
  }) 
});



app.get('/', (req, res) => {
  console.log(req)
  res.sendFile('./assets/login.html', { root: __dirname })
});

/*
app.get('/inicio', (req, res) => {
  console.log(req)
  res.sendFile('./assets/login.html', { root: __dirname })
}); */


// registro
app.get('/register', (request, response) => {
    console.log(request);
    response.sendFile('./assets/registro.html', { root: __dirname })
} )



/*
//nosotros, esta ruta me mostrara el contador
app.get('/nosotros', (request, response) => {
 console.log(request);
  
  response.sendFile('./assets/contador.txt', { root: __dirname })
} )

//restablecer-contrasena 
app.get('/restablecer-contrasena', (request, response) => {
  console.log(request);
  response.sendFile('./assets/restablecer-contrasena.html', { root: __dirname })
} ) */


/*app.get('/auth/login', (req, res) => {
  console.log(req)
  res.sendFile('./assets/login.html', { root: __dirname })
}); */


/* LOGIN METHOD FOR USERS REGISTRATION*/
app.post('/login', (req, res) => {
  console.log(req.body.email)
  console.log(req.body.password);

  let email = req.body.email;
  let password = req.body.password;

  fs.readFile('db.json', (error, data) => {
      let users = JSON.parse(data.toString()); // obtengo todos los usuarios que esten en el archivoo que estoy leyendo
    //const { name, email, password, password2 } = req.body;
        let userObj = users.find(user => {
            return user.email = email;
        });
        if(userObj.password === password){
          console.log('la contraseña es correcta');
          res.redirect('indexx.html' )
      }else {
          console.log('no coincide');
          res.redirect('login.html' )
            //res.sendFile('./assets/login.html', { root: __dirname })
      }
      console.log(users)
      
  })
//  res.status(200).send("RESPUESTA SATISFACTORIA")
});

// res.status(200).sendFile('./assets/indexx.html')


/* POST METHOD, FOR USER REGISTRATION*/
app.post('/register', (req, res) => {
  
fs.readFile('db.json', (error, data) => {
    if(error){
        console.log(error);
    }
    let users = JSON.parse(data.toString()); //Transformarlo a un objeto literal javascript para poder manipularlo
    users.push(req.body); //Voy agregar los datos que estoy recibiendo a través de la petición
    fs.writeFile('db.json', JSON.stringify(users), (error) => {
        if(error) { 
            console.log(error);
        }
        res.redirect('/');
      });
    
});

});






/* Manejador de errores de rutas falsas, funciona con 3 argumentos */ 
/*  Hay otro que es el manejador d errores y funciona con cuatro arguemnos, el ultimo next
para pasar a la siguiente accion que tenga el software*/ // es un middleware, tiene tres args
app.use((req, res, next) => {
  console.log(req)
  res.status(404).sendFile('./assets/404.html', { root: __dirname });
  next()
}); 



// Inicio el servidor
app.listen(8000, () => {
    console.log("Servidor iniciado en el puerto 8000")
})