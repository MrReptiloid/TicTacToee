var express = require('express')
var http = require('http')
var path = require('path')
var socketIO = require('socket.io')

var app = express()
var server = http.Server(app)
var io = socketIO(server)

app.set('port', 5050)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(5050, function () {
    console.log('Starting server on port 1337')
});

var pole = [0,0,0,0,0,0,0,0,0]
var players = []
var walkNow = null
var i = 0
var winData = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]]

io.on('connection', function (socket) {
    socket.on('new player', function () {
        io.sockets.emit('state', pole)
        players.push(socket.id)
        walkNow = players[0]
    })

    socket.on('click', function(index){
        console.log(walkNow == socket.id)
        if(walkNow == socket.id){
            if (i % 2 == 0 && pole[index] == 0) {
                pole[index] = 1
            } else if (i % 2 == 1 && pole[index] == 0) {
                pole[index] = 2   
            }
            i++
            io.sockets.emit('state', pole) 
            pole = checkFinish(pole)
            if(walkNow == players[0]){
                walkNow = players[1]
            }else if(walkNow == players[1]){
                walkNow = players[0]
            }
        }
    })
})


const checkFinish = function(pole){
    for (var i in winData){
        if (pole[winData[i][0]] == 1 && pole[winData[i][1]] == 1 && pole[winData[i][2]] == 1){
            return reset(0)
        } else if(pole[winData[i][0]] == 2 && pole[winData[i][1]] == 2 && pole[winData[i][2]] == 2){
            return reset(1)
        }
    }

    if(pole.indexOf(0) == -1){
        return reset()
    } else {
        return pole
    }
}

const reset = function(winner){
    pole = [0,0,0,0,0,0,0,0,0]
    io.sockets.emit('win', players[winner])
    setTimeout(function(){
        io.sockets.emit('state', pole)}, 2000)
    return pole
}

