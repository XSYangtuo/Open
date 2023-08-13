var ClassRoom = {
    newClassRoom:function(population,purpose){
        return{
            population:population,
            purpose:purpose
        }
    }
}
function testNewClassRoom(times,population,from,to){
    let classRooms = [];
    for(let i =0;i<times;i++){
        classRooms.push(ClassRoom.newClassRoom(population,[i+1<=(times/2)?from:to]));
    }
    return classRooms;
}