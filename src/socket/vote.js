// chat.js에서 vote이벤트 만들고 보내고 
// socket에서 vote로 이벤트 받고 처리하고 다시 chat.js로 보내기

export const handleVoteEvent = (io, socket) => {

    //socket.user = {name: socket.id};

    // 클라이언트에서 온 이벤트 접수
    socket.on('vote', async (data) => {
        try {
            const socketId = socket.id;

            console.log("select data 확인 ", data);

            // 서버에서 클라이언트로 발송
            io.emit('vote', { socketId, option: data.option });
            console.log("타입 확인 ",{ socketId, option: data.option } )
            console.log("select : ", data);

        } catch (err) {
            console.error("Error :", err);
        }
    })
}