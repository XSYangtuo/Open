function drawLine(x1,y1,x2,y2){
    canvas.moveTo(x1,y1);
    canvas.lineTo(x2,y2);
    canvas.stroke();
}
function distance(a,b){//计算距离
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function sitaGiver(rx,ry){//专门用来算角度
    let sita;//角度
    if(rx ==0) {//tan90度一生之敌
        sita = ry>0?Math.PI/2:-Math.PI/2;
    }else sita = Math.atan(ry/rx);
    if(sita == 0 && rx<0) sita = Math.PI;
    //sita 修正，因为tan函数的周期性只有一个PI
    if((rx<0&&ry<0)||(rx<0&&ry>0)) sita+=Math.PI;
    return sita;
}
function clearScreen(){
    canvas.fillRect(0,0,10000,10000);
}
var doubleMax = Number.MAX_VALUE;
var doubleMin = Number.MIN_VALUE;
var canvas = $("canvas")[0].getContext("2d");
var runTimes = 0;
var isRunning = false;
var structure={
    floor:4,//层数
    maxX:150,
    maxY:220,
    floorHeight:28,//楼层高度，包括长轴
    population:52,
    classRoomMargin:3.5,
    classWidth:13.3333,
    floorPoints:[
        {x:0,y:0,id:0,width:4},
        {x:106.66667,y:0,id:1,width:4},
        {x:0,y:106.66667,id:2,width:8},
        {x:106.66667,y:106.66667,id:3,width:8},
        {x:0,y:213.333333,id:4,width:8},
        {x:106.66667,y:213.333333,id:5,width:8},
    ],//楼梯节点

    getPointsFront:[],
    getHWsFront:[],
    getPointsLeft:[],
    getHWsLeft:[],
    getPointsRight:[],
    getHWsRight:[],
    getPointsBehind:[],
    getHWsBehind:[],
    init:function(){
        this.floorConnections=[
            {from:0,to:1,width:10,classCounts:0,leftW:5,rightMark:0,leftMark:0,id:0},
            {from:1,to:3,width:20,classCounts:0,leftW:5,rightMark:0,leftMark:0,id:1},
            {from:2,to:3,width:8,classCounts:4,leftW:2+2*this.classWidth+this.classRoomMargin,rightMark:0,leftMark:0,id:2},
            {from:3,to:5,width:20,classCounts:0,leftW:5,rightMark:0,leftMark:0,id:3},
            {from:4,to:5,width:10,classCounts:4,leftW:2+2*this.classWidth+this.classRoomMargin,rightMark:0,leftMark:0,id:4},
        ];




        //生成第一层,初始值最小最大，最大最小
        let yMax = doubleMin;
        let yMin = doubleMax;
        let xMax = doubleMin;
        let xMin = doubleMax;
        for(let i in this.floorPoints){
            let fi = this.floorPoints[i];


            if(fi.y == yMax)this.getPointsFront.push(fi);
            if(fi.y>yMax){
                yMax =fi.y;
                this.getPointsFront = [];
                this.getPointsFront.push(fi);
            }
            if(fi.y==yMin) this.getPointsBehind.push(fi);
            if(fi.y<yMin){
                yMin =fi.y;
                this.getPointsBehind = [];
                this.getPointsBehind.push(fi);
            }
            if(fi.x == xMax)this.getPointsRight.push(fi);
            if(fi.x>xMax){
                xMax =fi.x;
                this.getPointsRight = [];
                this.getPointsRight.push(fi);
            }
            if(fi.x==xMin) this.getPointsLeft.push(fi);
            if(fi.x<xMin){
                xMin =fi.x;
                this.getPointsLeft = [];
                this.getPointsLeft.push(fi);
            }
            

            for(let ii=0;ii<this.floor;ii++){
                Hole.newHole(fi.width,this.floorHeight,ii,fi.id);
            }
        }

        for(let i in this.floorConnections){
            let fi = this.floorConnections[i];
            
            if(this.getPointsFront.includes(this.floorPoints[fi.from]) && 
            this.getPointsFront.includes(this.floorPoints[fi.to]))this.getHWsFront.push(fi);
            if(this.getPointsBehind.includes(this.floorPoints[fi.from]) && 
            this.getPointsBehind.includes(this.floorPoints[fi.to]))this.getHWsBehind.push(fi);
            if(this.getPointsLeft.includes(this.floorPoints[fi.from]) && 
            this.getPointsLeft.includes(this.floorPoints[fi.to]))this.getHWsLeft.push(fi);
            if(this.getPointsRight.includes(this.floorPoints[fi.from]) && 
            this.getPointsRight.includes(this.floorPoints[fi.to]))this.getHWsRight.push(fi);


            for(let ii=2;ii<=this.floor;ii++){
                HallWay.newHallWay(fi.width,distance(this.floorPoints[fi.from],this.floorPoints[fi.to]),ii,this.floorConnections[i].id,
                this.floorConnections[i].from,this.floorConnections[i].to,testNewClassRoom(fi.classCounts,this.population,0,1),//默认一边向左一边向右
                this.classRoomMargin,fi.leftW,fi.leftMark,fi.rightMark);
            }
        }
        

    }
}

function run(){
    for(let i in HallWay.hallWay){
        if(HallWay.hallWay[i] == undefined) continue;
        for(let ii in HallWay.hallWay[i]){
            if(HallWay.hallWay[i][ii] == undefined) continue;
            HallWay.hallWayRun(HallWay.hallWay[i][ii]);
        }
    }
    for(let i in Hole.holes){
        if(Hole.holes[i] == undefined) continue;
        for(let ii in Hole.holes[i]){
            if(Hole.holes[i][ii] == undefined) continue;
            Hole.runHole(Hole.holes[i][ii]);
        }
    }
    if(isRunning) runTimes++;
    isRunning = false;
}
function disPlayOn(tfloor){
    canvas.fillStyle = "white";
    clearScreen();
    let offSetX = 30;
    let offSetY = 30;
    let scale = 5;
    let ha = HallWay.hallWay[tfloor];
    for(let i in ha){
        if(ha[i].floor != tfloor) continue;
        let leftPoint = structure.floorPoints[ha[i].leftConnection];
        let rightPoint = structure.floorPoints[ha[i].rightConnection];
        if(leftPoint.y == rightPoint.y){
            if(leftPoint.x>rightPoint.x) {
                let cg = leftPoint;
                leftPoint = rightPoint;
                rightPoint = cg;
            }
            HallWay.displayHallWay(ha[i],offSetX+scale*leftPoint.x,offSetY+scale*leftPoint.y,scale*(rightPoint.x-leftPoint.x),false);
        }else{
            if(leftPoint.y>rightPoint.y) {
                let cg = leftPoint;
                leftPoint = rightPoint;
                rightPoint = cg;
            }
            HallWay.displayHallWay(ha[i],offSetX+scale*leftPoint.x,offSetY+scale*leftPoint.y,scale*(rightPoint.y-leftPoint.y),true);

        }
    }
}
function disPlayFront(){
    canvas.fillStyle = "white";
    clearScreen();
    let scale = 5;
    let offSetX = 30;
    let offSetY = 30+structure.floor*(structure.floorHeight)*scale;
    for(let i in structure.getPointsFront){
        let fi = structure.getPointsFront[i];
        let baseY = offSetY;
        for(let ii=0;ii<structure.floor;ii++){
            let holei = Hole.holes[ii][fi.id];
            Hole.displayHole(holei,offSetX+scale*fi.x,baseY,holei.width*scale);
            baseY-= structure.floorHeight*scale;
        }
    }

    for(let i in structure.getHWsFront){
        let fi = structure.getHWsFront[i];
        let baseY = offSetY-structure.floorHeight*scale;
        for(let ii=2;ii<=structure.floor;ii++){
            let halli = HallWay.hallWay[ii][fi.id];
            let leftPoint = structure.floorPoints[halli.leftConnection];
            let rightPoint = structure.floorPoints[halli.rightConnection];
            HallWay.displayHallWay(halli,Math.min(offSetX+scale*(leftPoint.x+leftPoint.width/2),offSetX+scale*(rightPoint.x+rightPoint.width/2)),baseY,scale*(rightPoint.x-leftPoint.x),false,
            leftPoint.x>rightPoint.x);
            baseY-= structure.floorHeight*scale;
        }
    }

}

function disPlayBehind(){
    canvas.fillStyle = "white";
    clearScreen();
    let scale = 5;
    let offSetX = 30;
    let offSetY = 30+structure.floor*(structure.floorHeight)*scale;
    for(let i in structure.getPointsBehind){
        let fi = structure.getPointsBehind[i];
        let baseY = offSetY;
        for(let ii=0;ii<structure.floor;ii++){
            let holei = Hole.holes[ii][fi.id];
            Hole.displayHole(holei,offSetX+scale*(structure.maxX-fi.x),baseY,holei.width*scale);
            baseY-= structure.floorHeight*scale;
        }
    }

    for(let i in structure.getHWsBehind){
        let fi = structure.getHWsBehind[i];
        let baseY = offSetY-structure.floorHeight*scale;
        for(let ii=2;ii<=structure.floor;ii++){
            let halli = HallWay.hallWay[ii][fi.id];
            let leftPoint = structure.floorPoints[halli.leftConnection];
            let rightPoint = structure.floorPoints[halli.rightConnection];
            HallWay.displayHallWay(halli,Math.min(offSetX+scale*(structure.maxX-leftPoint.x+leftPoint.width/2),offSetX+scale*(structure.maxX-rightPoint.x+rightPoint.width/2)),baseY,scale*(rightPoint.x-leftPoint.x),false,
            leftPoint.x<rightPoint.x);
            baseY-= structure.floorHeight*scale;
        }
    }

}

function disPlayLeft(){
    canvas.fillStyle = "white";
    clearScreen();
    let scale = 5;
    let offSetX = 30;
    let offSetY = 30+structure.floor*(structure.floorHeight)*scale;
    for(let i in structure.getPointsLeft){
        let fi = structure.getPointsLeft[i];
        let baseY = offSetY;
        for(let ii=0;ii<structure.floor;ii++){
            let holei = Hole.holes[ii][fi.id];
            Hole.displayHole(holei,offSetX+scale*fi.y,baseY,holei.width*scale);
            baseY-= structure.floorHeight*scale;
        }
    }

    for(let i in structure.getHWsLeft){
        let fi = structure.getHWsLeft[i];
        let baseY = offSetY-structure.floorHeight*scale;
        for(let ii=2;ii<=structure.floor;ii++){
            let halli = HallWay.hallWay[ii][fi.id];
            let leftPoint = structure.floorPoints[halli.leftConnection];
            let rightPoint = structure.floorPoints[halli.rightConnection];
            HallWay.displayHallWay(halli,Math.min(offSetX+scale*(leftPoint.y+leftPoint.width/2),offSetX+scale*(rightPoint.y+rightPoint.width/2)),baseY,scale*(rightPoint.y-leftPoint.y),false,
            leftPoint.y>rightPoint.y);
            baseY-= structure.floorHeight*scale;
        }
    }

}
function disPlayRight(){
    canvas.fillStyle = "white";
    clearScreen();
    let scale = 5;
    let offSetX = 30;
    let offSetY = 30+structure.floor*(structure.floorHeight)*scale;
    for(let i in structure.getPointsRight){
        let fi = structure.getPointsRight[i];
        let baseY = offSetY;
        for(let ii=0;ii<structure.floor;ii++){
            let holei = Hole.holes[ii][fi.id];
            Hole.displayHole(holei,offSetX+scale*(structure.maxY-fi.y),baseY,holei.width*scale);
            baseY-= structure.floorHeight*scale;
        }
    }

    for(let i in structure.getHWsRight){
        let fi = structure.getHWsRight[i];
        let baseY = offSetY-structure.floorHeight*scale;
        for(let ii=2;ii<=structure.floor;ii++){
            let halli = HallWay.hallWay[ii][fi.id];
            let leftPoint = structure.floorPoints[halli.leftConnection];
            let rightPoint = structure.floorPoints[halli.rightConnection];
            HallWay.displayHallWay(halli,Math.min(offSetX+scale*(structure.maxY-leftPoint.y+leftPoint.width/2),offSetX+scale*(structure.maxY-rightPoint.y+rightPoint.width/2)),baseY,scale*(rightPoint.y-leftPoint.y),false,
            leftPoint.y<rightPoint.y);
            baseY-= structure.floorHeight*scale;
        }
    }

}