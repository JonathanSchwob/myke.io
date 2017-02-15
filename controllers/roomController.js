const Hashids = require('hashids');
const shortid = require('shortid');

let rooms = {};
let quantity = 0;

module.exports.createNewRoom = function(adminSessionId, roomData, callback){
  const id = shortid.generate();
  rooms[id] = roomData;
  rooms[id].adminSessionId = adminSessionId;
  console.log(rooms[id]);
  callback(id);
}

module.exports.getRoomInfo = function(roomId, callback){
  if (rooms[roomId]){
    callback(null, rooms[roomId]);
  }else{
    callback("room does not exist", null);
  }
}

module.exports.updateHostPeerId = function(roomId, requestId, peerId,callback){
  if (rooms[roomId].adminId === requestId && rooms[roomId]){
    rooms[roomId].adminPeer = peerId;
    callback(null,peerId);
  }else {
    callback('not auth');
  }
}
