var socket = io()
var canvas = document.getElementById('canvas')
canvas.width = 300
canvas.height = 300
var context = canvas.getContext('2d')

const drawGrid = function(){
    context.moveTo(0, 100)
    context.lineTo(300, 100)

    context.moveTo(0, 200)
    context.lineTo(300, 200)

    context.moveTo(100, 0)
    context.lineTo(100, 300)

    context.moveTo(200, 0)
    context.lineTo(200, 300)

    context.stroke()
}

drawGrid()

document.addEventListener('mousedown', function (event) {
    if (event.x < 300 && event.y < 300) {
        posX = Math.round(event.x / 100 + 0.5) - 1
        posY = Math.round(event.y / 100 + 0.5) - 1 
        indexCliCk = posX * 3 + posY
        console.log(indexCliCk)
        socket.emit('click', indexCliCk);
    }
});

socket.emit('new player')

socket.on('state', (pole) => {
    context.fillStyle = 'white'
    context.beginPath()
    for (var k in pole) {
        i = Math.floor(k / 3)
        j = k % 3
        console.log(i,j,k)
        if (pole[k] == 1) {
            context.moveTo(i * 100 + 20, j * 100 + 20)
            context.lineTo(i * 100 + 80, j * 100 + 80)

            context.moveTo(i * 100 + 80, j * 100 + 20)
            context.lineTo(i * 100 + 20, j * 100 + 80)

            context.stroke()
        }
        else if (pole[k] == 2) {
            context.moveTo(i * 100 + 91, j * 100 + 50)
            context.arc(i * 100 + 50, j * 100 + 50, 41, 0, 2 * Math.PI)
            context.stroke()
        }
        else if (pole[k] == 0) {
            context.rect(i * 100, j * 100, 100, 100)
            context.fill()
        }
    }
   drawGrid()
})

socket.on('win' , (winId) => {
    if(winId == socket.id){
        context.fillStyle = 'green'
    }else{
        context.fillStyle = 'red'
    }
    context.beginPath()
    context.rect(5,5,290,290)
    context.fill()
})
