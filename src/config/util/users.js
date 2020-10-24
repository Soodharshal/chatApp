const users = [];
const addUser = ({ id, userName, room }) => {

    username = userName.trim().toLowerCase()
    room = room.trim().toLowerCase()


    //validate user
    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    //checking the existing user
    const existingUser = users.find((user) => {
        return user.userName === username && user.room === room
    })
    if (existingUser) {
        return {
            error: 'user already exist'
        }
    }

    //removing user
    const user = { id, userName, room }
    users.push(user);
    return { user }

}
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = function (id) {
    return users.find((user) => user.id === id)
}

const getUserWithInRoom = function (room) {
    return users.filter((user) => user.room === room)
}

// addUser({
//     id: 22,
//     userName: 'Andrew',
//     room: '123'
// })

// addUser({
//     id: 23,
//     userName: 'James',
//     room: '123'
// })
// addUser({
//     id: 23,
//     userName: 'kimmu',
//     room: '1234'
// })

// const res = addUser({
//     id: 24,
//     userName: '',
//     room: ''
// })

module.exports = {
    getUser, getUserWithInRoom, addUser, removeUser
}