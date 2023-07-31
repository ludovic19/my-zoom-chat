 const app = require("express")()
 const server = require ("http").createServer(app)
 const cors = require("cors")
//  io server side instance 
//socket are used to transmate in real time data between the client and the server
// Créer une instance de Socket.IO en utilisant le serveur HTTP avec autorisation de l'origine de la connexion ici toute mais definir une adresse pour une mis en prod
//autoriser les methodes GET et POST 
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"] 
    }
 })
 // to see that this cors is not being used
 app.use(cors());

// *** declare the port to listen to
 const PORT = process.env.PORT || 3000//5000

 // *** FIRST ROUTE
 app.get("/", (req, res) => {
     res.send("Server is running")
 })
 // *** Définir ce qui se passe lorsque qu'un client se connecte et se deconnecte
 io.on("connection", (socket) => {
    socket.emit('me', socket.id )
    socket.on('disconnect', () => {
            socket.broadcast.emit('callended')
        })
        // Ce code représente une partie de la logique côté serveur utilisant Socket.IO pour gérer les connexions des clients et la déconnexion des clients. Voici une explication ligne par ligne :

        // io.on("connection", (socket) => { ... }): Cela écoute l'événement "connection" émis par Socket.IO lorsque qu'un nouveau client se connecte au serveur. La fonction de rappel est exécutée lorsque la connexion est établie, et elle prend comme argument un objet socket qui représente la connexion unique avec ce client spécifique.
        
        // socket.emit('me', socket.id): Lorsqu'un client se connecte, cette ligne émet un événement personnalisé "me" vers ce client spécifique. L'événement "me" est utilisé pour envoyer l'ID du socket au client, afin que le client puisse identifier cette connexion particulière. Le client recevra cette information sous forme d'événement "me" avec l'ID du socket en tant que donnée.
        
        // socket.on('disconnect', () => { ... }): Cette partie du code écoute l'événement "disconnect" émis par Socket.IO lorsque le client se déconnecte du serveur (c'est-à-dire ferme la page du navigateur, perd la connexion, etc.). La fonction de rappel est exécutée lorsque la déconnexion se produit.
        
        // socket.broadcast.emit('callended'): Lorsque le client se déconnecte, cette ligne émet un événement "callended" à tous les autres clients connectés. Cela permet d'informer les autres clients qu'un appel ou une communication avec ce client particulier a été terminé.
        
        // En résumé, ce code permet d'émettre l'ID du socket au client lorsqu'il se connecte, et lorsqu'un client se déconnecte, tous les autres clients connectés sont informés que l'appel ou la communication avec ce client spécifique a été terminé. Cela peut être utilisé pour gérer la logique de déconnexion et de notification dans une application de communication en temps réel.
    socket.on('calluser', ({ userToCall, signalData, from, name}) => {
            io.to(userToCall).emit('calluser', { signal:signalData, from, name })
        })
        
        // Ce code représente une autre partie de la logique côté serveur utilisant Socket.IO. Voici une explication ligne par ligne :

        // socket.on('calluser', ({ userToCall, signalData, from, name }) => { ... }): Cette partie du code écoute l'événement personnalisé "calluser" émis par un client lorsqu'il souhaite appeler un autre utilisateur. L'événement "calluser" contient des informations sur l'appel, notamment l'ID de l'utilisateur à appeler (userToCall), les données de signalisation pour établir la connexion peer-to-peer (signalData), l'ID de l'utilisateur qui initie l'appel (from), et le nom de l'utilisateur qui initie l'appel (name).

        // io.to(userToCall).emit('calluser', { signal: signalData, from, name }): Lorsque l'événement "calluser" est reçu par le serveur, cette ligne émet à l'utilisateur spécifié par userToCall un nouvel événement "calluser" avec des informations de signal (signalData), l'ID de l'appelant (from), et le nom de l'appelant (name). Cela permet d'informer l'utilisateur à appeler qu'il reçoit un appel et de lui transmettre les informations nécessaires pour établir la connexion peer-to-peer.

        // En résumé, ce code permet de gérer l'appel entre deux utilisateurs en écoutant l'événement "calluser" émis par un client qui souhaite initier un appel. Lorsque cet événement est reçu, le serveur émet un événement "calluser" à l'utilisateur spécifié pour l'appel avec les informations nécessaires pour établir la connexion en temps réel. Cela permet de mettre en place la communication en direct entre les utilisateurs de l'application.
    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal)
    })    

    // Ce code représente une autre partie de la logique côté serveur utilisant Socket.IO pour gérer la réponse à un appel. Voici une explication ligne par ligne :

    // socket.on("answercall", (data) => { ... }): Cette partie du code écoute l'événement personnalisé "answercall" émis par un client en réponse à un appel entrant. L'événement "answercall" contient des informations nécessaires pour répondre à l'appel, notamment data.to, qui est l'ID de l'utilisateur qui a initié l'appel, et data.signal, qui contient les données de signalisation pour établir la connexion peer-to-peer.

    // io.to(data.to).emit("callaccepted", data.signal): Lorsque l'événement "answercall" est reçu par le serveur, cette ligne émet un nouvel événement "callaccepted" à l'utilisateur spécifié par l'ID data.to. Cela permet de notifier l'utilisateur qui a initié l'appel que l'appel a été accepté. Les données de signalisation (data.signal) sont incluses dans l'événement pour permettre l'établissement de la connexion peer-to-peer entre les deux utilisateurs.

    // En résumé, ce code permet de gérer la réponse à un appel en écoutant l'événement "answercall" émis par un client en réponse à un appel entrant. Lorsque cet événement est reçu, le serveur émet un événement "callaccepted" à l'utilisateur qui a initié l'appel, en incluant les données de signalisation nécessaires pour établir la connexion en temps réel entre les deux utilisateurs, permettant ainsi de commencer la communication bidirectionnelle. Cela permet de réaliser des appels en direct entre les utilisateurs de l'application.
 })



 //listen to the port
 server.listen(PORT, () => {
     console.log(`Server is listening on port ${PORT}`)
 })

 

