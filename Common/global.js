var roomData = {
    id: null,
    name: '',
    mainCharacterID: null,
    member: [],
    message: [],
};

function updateRoomData(data) {
    if (data.id) roomData.id = data.id;
    if (data.roomName) roomData.name = data.roomName;
    if (data.roomMember) roomData.member = data.roomMember;
}

function useRoomData() {
    return roomData;
}