const socket = io('http://localhost:3000');
 
$('#divCall').hide();

// let customConfig;

// $.ajax({
//     url: "https://service.xirsys.com/ice",
//     data: {
//       ident: "truonganhtuan",
//       secret: "1033233c-8390-11ed-8dbc-0242ac130003",
//       domain: "file:///D:/RTC/index.html",
//       application: "default",
//       room: "default",
//       secure: 1
//     },
//     success: function (data, status) {
//       // data.d is where the iceServers object lives
//       customConfig = data.d;
//       console.log(customConfig);
//     },
//     async: false
//   });



socket.on('DANH_SACH_ONLINE',arrUserInfo =>{
    $('#divCall').show();
    $('#divDangKy').hide();
    arrUserInfo.forEach(user => {
        const {ten, peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI',user =>{
        const {ten , peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_DA_ROI_PHONG', peerId =>{
        $(`#${peerId}`).remove();
    });
});






socket.on('DANG_KY_THAT_BAO',() => alert('Username da ton tai!'));
function openStream(){
    const config = {audio: false,video: true};
    return navigator.mediaDevices.getUserMedia(config);
};

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
};

// openStream()
// .then(stream => playStream('vdLocalStream',stream));
const peer = new Peer({key: 'tkv5g2acaree9udi' });

peer.on('open',id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() =>{
        const username = $('#txtUserName').val();
        socket.emit('NGUOI_DUNG_DANG_KY',{ ten: username, peerId: id });
    });
});

//nguoi goi
$('#btnCall').click(() =>{
    const id = $('#remoteId').val();
    openStream()
    .then(stream =>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
    });
});
//nguoi nhan
peer.on('call',call => {
    openStream()
    .then(stream =>{
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
    });
});

$('#ulUser').on('click','li', function() {
   const id = $(this).attr('id');
    openStream()
    .then(stream =>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
    });
});
