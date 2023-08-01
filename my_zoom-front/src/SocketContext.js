import React, {createConext, useState, useRef, useEffect} from 'react';
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const socketContext = createConext()

const socket = io('http://localhost:3000')

const ContextProvider = ({children}) => { 
    // creer les fonctions necessaires à l'app répondre à lappel, appel de user, quitter lappel
    const[stream, setStream] = useState(null)
    const[me, setMe] = useState('')
    const[call, setCall] = useState({})
    const[callAccepted, setCallAccepted] = useState(false)
    const[callEnded, setCallEnded] = useState(false)
    const[name, setName] = useState('')
    
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    useEffect(() => {
        // permission d'utiliser la cam et l'audio avec fct  native navigator
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((currentStream) => {
                setStream(currentStream)

                myVideo.current.srcObject = currentStream
            })
        socket.on('me', (id) => setMe(id))

        socket.on('calluser', ({ from, name: callerName, signal}) => {
             setCall({ isReceivedCall: true, from, name: callerName, signal })
        })
, []}
)
    const answercall = ()   => {
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false,  stream })
    
        peer.on('signal', (data) => {
            socket.emit('answercall', {signal: data, to: call.from})
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })
        peer.signal(call.signal)

        connectionRef.current = peer
    }
    const callUser = (id) => {
//on connait qui est le user par son id
        const peer = new Peer({ initiator: true, trickle: false })//we are the initiator
        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })
        socket.on ('callaccepted', (signal) => {
            setCallAccepted(true) 
            peer.signal(signal)
        })
        connectionRef.current = peer
    }

    const leaveCall = () => {
         setCallEnded(true)
         connectionRef.current.destroy()//detruire la connection
         window.location.reload()//recharger la page
    }
    return (
        <socketContext.Provider value={{call,callAccepted,callEnded,myVideo,userVideo,stream,name,setName, leaveCall,answercall,me,callUser}}>
            {children}
        </socketContext.Provider>) 
}

export default ContextProvider