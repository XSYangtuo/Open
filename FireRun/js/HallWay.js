var HallWay = {
    hallWay:[],
    newHallWay:function(width,length,floor,id,leftConnection,rightConnection,classRooms,
        classRoomMargin,leftW,leftMark,rightMark){
        if(this.hallWay[floor] == undefined)this.hallWay[floor] = [];
        this.hallWay[floor][id] = {
            width:width,
            length:length,
            floor:floor,
            leftConnection:leftConnection,
            rightConnection:rightConnection,
            classRooms:classRooms,
            classRoomMargin:classRoomMargin,
            leftW:leftW,
            leftMark:leftMark,
            rightMark:rightMark,
            people:[],
            leftEmpty:true,
            rightEmpty:true
        };
        return this.hallWay[floor][id];
    },
    newPeo:function(people,x,y,vx,vy,purpose){
        people.push({
            x:x,
            y:y,
            vx:vx,
            vy:vy,
            purpose:purpose,
            nowPurpose:purpose.shift(),
            color:"#"+Math.floor(Math.random()*900000)
        });
    },
    joinPeo:function(hallwT,peO,isLeft){
        peO.vx = peO.vy = 0;
        peO.x = Math.random()*hallwT.width;
        peO.y = isLeft?(hallwT.leftMark+2):(hallwT.length-hallwT.rightMark-2);
        peO.nowPurpose = peO.purpose.shift();
        hallwT.people.push(peO);
    },
    displayHallWay:function(hallwT,lefx,upy,length,isVertical,isInversed){
        let people = hallwT.people;
        let holeMaxX = hallwT.width;
        let holeMaxY = hallwT.length;
        let wid = length/holeMaxY*holeMaxX;
        let classrooms = hallwT.classRooms;
        let margin = hallwT.classRoomMargin;
        let leftW = hallwT.leftW;
        let tailY=(isVertical?upy:lefx)+wid*holeMaxY/holeMaxX;
        // lefx = 200,upy=200,wid=100;
        canvas.beginPath();
        canvas.strokeStyle = "black";
        if(isVertical){
            drawLine(lefx,upy,lefx,tailY);
            drawLine(lefx+wid,upy,lefx+wid,tailY);
        }else{
            drawLine(lefx,upy,tailY,upy);
            drawLine(lefx,upy+wid,tailY,upy+wid);
        }
        
        let usY = leftW+1;
        // canvas.strokeStyle = "gey";
        canvas.fillStyle = "black";
        canvas.font=Math.max(20,wid/3)+"px Georgia";
        let classRoomWidth = wid/5;
        for(let i in classrooms){
            if(isVertical){
                canvas.fillRect(lefx+(isInversed?-classRoomWidth:wid),isInversed?(tailY-wid*usY/holeMaxX):(upy+wid*usY/holeMaxX),classRoomWidth,wid*(structure.classWidth)/holeMaxX);
                canvas.fillText(classrooms[i].population,lefx+(isInversed?-classRoomWidth-wid/1.5:wid+wid/1.5),isInversed?(tailY-wid*usY/holeMaxX):(upy+wid*usY/holeMaxX));
            }
            else{
                canvas.fillRect(isInversed?(tailY-wid*usY/holeMaxX):(lefx+wid*usY/holeMaxX),upy+(isInversed?-classRoomWidth:wid),wid*(structure.classWidth)/holeMaxX,classRoomWidth);
                canvas.fillText(classrooms[i].population,isInversed?(tailY-wid*usY/holeMaxX):(lefx+wid*usY/holeMaxX),upy+(isInversed?-classRoomWidth-wid/1.5:wid+wid/1.5));
            }
            usY+=structure.classWidth+margin;
        }
        // canvas.fillStyle = "red";
        // for(let i in people){
        //     if(people[i] == null) continue;
        //     canvas.beginPath();
        //     canvas.arc(lefx+wid*people[i].x/holeMaxX,upy+wid*people[i].y/holeMaxX,wid*1/holeMaxX+0.3,0,2*Math.PI);
        //     canvas.fill();
        // }
        for(let i in people){
            let peo = people[i];
            if(peo == null) continue;
            canvas.fillStyle = peo.color;
            canvas.beginPath();
            if(isVertical){
                canvas.arc(isInversed?(lefx+wid-wid*peo.x/holeMaxX):(lefx+wid*peo.x/holeMaxX),isInversed?(tailY-wid*peo.y/holeMaxX):(upy+wid*peo.y/holeMaxX),wid*1/holeMaxX,0,2*Math.PI);
            }else{
                canvas.arc(isInversed?(tailY-wid*peo.y/holeMaxX):(lefx+wid*peo.y/holeMaxX),isInversed?(upy+wid-wid*peo.x/holeMaxX):(upy+wid*peo.x/holeMaxX),wid*1/holeMaxX,0,2*Math.PI);
            }
            //速度
            // drawLine(lefx+wid*peo.y/holeMaxX,upy+wid*peo.x/holeMaxX,
            // lefx+wid*(peo.y+peo.vy*10)/holeMaxX,upy+wid*(peo.x+peo.vx*10)/holeMaxX)
            canvas.fill();
            //if(peo.purpose==hallwT.leftConnection && peo.vy>0) console.log(peo);
        }
        canvas.beginPath();
    },
    hallWayRun:function(hallwT){
        let people = hallwT.people;
        let holeMaxX = hallwT.width;
        let holeMaxY = hallwT.length;
        let classrooms = hallwT.classRooms;
        let margin = hallwT.classRoomMargin;
        let leftW = hallwT.leftW;
        let leftMark = hallwT.leftMark;
        let rightMark = hallwT.rightMark;
        for(let i in people){
            let peo = people[i];
            if(peo == null) continue;
            //if(peo.locked) continue;
            isRunning = true;
            if(peo.y>holeMaxY-rightMark || peo.y<0+leftMark) {
                //peo.locked = true;
                //如果已经是最下面一层则直接逃生
                // if(hallwT.floor == 1) {people[i] = null;continue;}
                if(peo.nowPurpose == 0 && peo.y<0+leftMark) {
                    if(peo.purpose.length != 0) {//还有别的路线要走
                        let nextToGo = peo.purpose.shift();
                        HallWay.joinPeo(HallWay.hallWay[hallwT.floor][nextToGo],peo,peo.purpose[0] == 1);
                        people[i] = null;continue;
                    }
                    if(Hole.holes[hallwT.floor-1][hallwT.leftConnection].isAvaliable){
                        Hole.joinPeo(Hole.holes[hallwT.floor-1][hallwT.leftConnection],peo);
                        people[i] = null;continue;
                    }
                }
                if(peo.nowPurpose == 1 && peo.y>holeMaxY-rightMark) {
                    if(peo.purpose.length != 0) {//还有别的路线要走
                        let nextToGo = peo.purpose.shift();
                        HallWay.joinPeo(HallWay.hallWay[hallwT.floor][nextToGo],peo,peo.purpose[0] == 1);
                        people[i] = null;continue;
                    }
                    if(Hole.holes[hallwT.floor-1][hallwT.rightConnection].isAvaliable){
                        Hole.joinPeo(Hole.holes[hallwT.floor-1][hallwT.rightConnection],peo);
                        people[i] = null;
                    }continue;
                }
                
                continue;//记得改
            }
            let outSpace = 1.5;//允许逃生的最小距离
            if(peo.x>holeMaxX-3){//阻止了门口同学的逃生
                let usY = leftW+1;
                for(let i in classrooms){
                    if(Math.abs(usY-1-peo.y)<outSpace) classrooms[i].left1 = true;
                    if(Math.abs(usY+1-peo.y)<outSpace) classrooms[i].left2 = true;
                    usY+=structure.classWidth;
                    if(Math.abs(usY-1-peo.y)<outSpace) classrooms[i].right1 = true;
                    if(Math.abs(usY+1-peo.y)<outSpace) classrooms[i].right2 = true;
                    usY+=margin;
                }
            }
            //v1
            // for(let ii in people){
            //     if(i==ii) continue;
            //     peoI = people[ii];
            //     if(distance(peo,peoI) <2){//发生碰撞
            //             //peo.vx=(peoI.vx<0?1:-1)*Math.max(Math.abs(peo.vx),0.5);
            //             peo.vx=0;
            //             if(peo.y<peoI.y)peo.vy=0;
            //     }
            // }
            let accuracy = 16;
            let acuR = Math.PI/accuracy/2;
            let purposeLeft = peo.nowPurpose==0;
            let correctByPurpose = purposeLeft?(-Math.PI):0;//对于反向者
            let minsit=Math.PI/2+correctByPurpose;let minWt=doubleMax;
            let vabs = 1//Math.floor(Math.min(Math.max(0.1/minWt,0.1),1)*Math.random()*10000)/10000;
            for(let sitk =acuR+correctByPurpose;sitk<=Math.PI+correctByPurpose;sitk+=acuR){
                let res = 0;
                let pd = {x:peo.x+vabs*Math.cos(sitk),y:peo.y+Math.sin(sitk)}
                for(let ii in people){
                    let peoI = people[ii];
                    if(people[ii] == null) continue;
                    if(i == ii || (purposeLeft?(peoI.y>= peo.y):(peoI.y<= peo.y))) continue;
                    let dist = distance(pd,peoI);
                    //!!if(purposeLeft) console.log(sitk/Math.PI*180,dist);
                    if(dist<=0.5 && peo.nowPurpose == peoI.nowPurpose){//res+=doubleMax;
                        peo.y+=0.3*(purposeLeft?1:-1);continue;
                    }
                    if(dist>=2.5) continue;
                    res+=1/dist;
                }
                if(res ==0){//轨道修正
                    minsit = Math.PI/2 +correctByPurpose;
                    minWt = Math.random()*0.5;
                    break;
                }
                res+=1/(Math.max(0.000000001,pd.x))*0.5;
                res+=1/(Math.max(0.000000001,Math.abs((holeMaxX-pd.x))))*0.5;
                
                //if(i==5)console.log(i+" "+sitk+" "+res)
                if(res>=0 && res<minWt){
                    minsit = sitk;
                    minWt = res;
                }
                
            }
            
            let oldSita =sitaGiver(peo.vx,peo.vy)+2*Math.PI;
            // let tests = [oldSita/Math.PI*180,minsit/Math.PI*180];
            // minsit = oldSita+(minsit-oldSita)*0.75;
            // if(purposeLeft&&minsit<Math.PI) console.log(minsit/Math.PI*180,tests);                
            vabs*=Math.random()*Math.min(1.5,10/minWt);
            peo.vx = vabs*Math.cos(minsit);
            //if(minWt>1.5)peo.vx*=-1; 
            peo.vy = vabs*Math.sin(minsit);
            if(purposeLeft) peo.vy= Math.min(0,peo.vy);
            else peo.vy= Math.max(0,peo.vy);
            peo.x+=peo.vx;
            if(peo.x<1) peo.x=1;
            if(peo.x>holeMaxX-1)peo.x=holeMaxX-1;
            peo.y+=peo.vy; 
            
        }
        let usY = leftW+1;
        for(let i in classrooms){
            //console.log("?")
            if((!classrooms[i].left1) && classrooms[i].population>0) {
                this.newPeo(people,holeMaxX-1,usY-1,0,0,classrooms[i].purpose.slice());classrooms[i].population--;}
            if((!classrooms[i].left2) && classrooms[i].population>0) {
                this.newPeo(people,holeMaxX-1,usY+1,0,0,classrooms[i].purpose.slice());classrooms[i].population--;}
            usY+=structure.classWidth;
            if((!classrooms[i].right1) && classrooms[i].population>0) {
                this.newPeo(people,holeMaxX-1,usY-1,0,0,classrooms[i].purpose.slice());classrooms[i].population--;}
            if((!classrooms[i].right2) && classrooms[i].population>0) {
                this.newPeo(people,holeMaxX-1,usY+1,0,0,classrooms[i].purpose.slice());classrooms[i].population--;}
            classrooms[i].left1 = classrooms[i].left2 = classrooms[i].right1 = classrooms[i].right2 = false;
            usY+=margin;
        }
    }
}