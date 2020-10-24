const socket = io()


// document.querySelector('#increment').addEventListener('click', () => {
//     socket.emit('increment')
// })

const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const messageTemplate = document.querySelector('#message-template').innerHTML
const loadMessages = document.querySelector('#loadMessages')
const locationTemplate = document.querySelector('#location-template').innerHTML
const sendLocation = document.querySelector('#sendLocation')
const sideBarTemplate = document.querySelector('#sideBar-template').innerHTML


const autoScroll = () => {
    const newMessage = loadMessages.lastElementChild;
    const newMessageStyle = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
    //visibe height
    const visibleHeight = loadMessages.offsetHeight
    //container height
    const containerHeight = loadMessages.scrollHeight;
    // scroll height
    const scrollOffSetHeight = loadMessages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffSetHeight) {
        loadMessages.scrollTop = loadMessages.scrollHeight
    }
}

//option
const { userName, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        loadMessages: message.text,
        createdAt: moment(message.createdAt).format('LT'),
        userName: message.username
    })
    loadMessages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('senLoc', (senLoc) => {
    const html = Mustache.render(locationTemplate, {
        sendLocation: senLoc.url,
        createdAt: moment(senLoc.createdAt).format('LT'),
        userName: senLoc.username
    })
    loadMessages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {

    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    document.querySelector('#sideBar').innerHTML = html;
})


messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    messageFormButton.setAttribute('disabled', 'disabled')
    const msg = e.target.elements.message.value
    socket.emit('gettingMsg', msg, (error) => {
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = ''
        messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message has been delivered!')
    })
})

const locationButton = document.querySelector('#sendLoc')
locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geo Location not supported by browser");
    }
    locationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        const data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', data, () => {
            locationButton.removeAttribute('disabled')
            console.log("Location shared")
        })
    })
})

socket.emit('join', { userName, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
})