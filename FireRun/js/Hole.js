var Hole = {
    holes:[],
    newHole:function(width,length,floor,id){
        if(this.holes[floor] == undefined) this.holes[floor] = [];
        this.holes[floor][id] = {
            width:width,
            length:length,
            people:[],
            floor:floor,
            id:id,
            isAvaliable:true
        }
        return this.holes[floor][id];
    },
    joinPeo:function(hole,peO){
        peO.vx = peO.vy = 0;
        peO.x = Math.random()*hole.width;
        peO.y = Math.random()*3;
        peO.color = "black";
        hole.people.push(peO);
        hole.isAvaliable = false;
    },
    runHole:function(hole){
        let people = hole.people;
        let holeMaxX = hole.width;
        let holeMaxY = hole.length;
        let sco = 0;//是否阻止上方的同学下行
        for(let i in people){
            let peo = people[i];
            if(peo == null) continue;
            isRunning = true;
            if(peo.y>holeMaxY) {
                if(hole.floor == 0) people[i] = null;
                else if(Hole.holes[hole.floor-1][hole.id].isAvaliable && Math.random()>0.75) {
                    Hole.joinPeo(Hole.holes[hole.floor-1][hole.id],peo);
                    people[i] = null;
                }
                
                continue;//记得改
            }
            if(peo.y<3) {
                sco++;
            }
            //let outSpace = 1;//允许逃生的最小距离
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
            let accuracy = 8;
            let acuR = Math.PI/accuracy/2;
            let minsit=Math.PI/2;let minWt=doubleMax;
            let vabs = 0.5//Math.floor(Math.min(Math.max(0.1/minWt,0.1),1)*Math.random()*10000)/10000;
            for(let sitk =acuR;sitk<=Math.PI;sitk+=acuR){
                let res = 0;
                let pd = {x:peo.x+vabs*Math.cos(sitk),y:peo.y+Math.sin(sitk)}
                for(let ii in people){
                    let peoI = people[ii];
                    if(people[ii] == null) continue;
                    if(i == ii || (peoI.y<= peo.y+0.1)) continue;
                    let dist = distance(pd,peoI);
                    //!!if(purposeLeft) console.log(sitk/Math.PI*180,dist);
                    if(dist<=0.5){//res+=doubleMax;
                        peo.y-=0.1;continue;
                    }
                    if(dist>=2.5) continue;
                    res+=1/dist;
                }
                if(res ==0){//轨道修正
                    minsit = Math.PI/2;
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
            peo.vy = vabs*Math.sin(minsit);
            //if(purposeLeft) peo.vy= Math.min(0,peo.vy);
            peo.vy= Math.max(0,peo.vy);
            peo.x+=peo.vx;
            if(peo.x<1) peo.x=1;
            if(peo.x>holeMaxX-1)peo.x=holeMaxX-1;
            peo.y+=peo.vy; 
            
        }
        if(sco>hole.width/3) hole.isAvaliable = false;
        else hole.isAvaliable = true;
    },
    displayHole:function(hole,lefx,upy,wid){
        canvas.fillStyle = "white";
        let people = hole.people;
        let holeMaxX = hole.width;
        let holeMaxY = hole.length;
        // canvas.fillStyle = "red";
        // for(let i in people){
        //     if(people[i] == null) continue;
        //     canvas.beginPath();
        //     canvas.arc(lefx+wid*people[i].x/holeMaxX,upy+wid*people[i].y/holeMaxX,wid*1/holeMaxX+0.3,0,2*Math.PI);
        //     canvas.fill();
        // }
        canvas.fillStyle = "black";
        for(let i in people){
            if(people[i] == null) continue;
            canvas.fillStyle = people[i].color;
            canvas.beginPath();
            canvas.arc(lefx+wid*people[i].x/holeMaxX,upy+wid*people[i].y/holeMaxX,wid*1/holeMaxX,0,2*Math.PI);
            canvas.fill();
        }
        canvas.beginPath();
        drawLine(lefx,upy,lefx,upy+wid*holeMaxY/holeMaxX);
        drawLine(lefx+wid,upy,lefx+wid,upy+wid*holeMaxY/holeMaxX);

    }
}
// for(let i in people){
//     let peo = people[i];
//     if(peo == null) continue;
//     if(peo.y>holeMaxY) {
//         people[i] = null;continue;//记得改
//     }
//     peo.x+=peo.vx;
//     if(peo.x<1) peo.x=1;
//     if(peo.x>holeMaxX-1)peo.x=holeMaxX-1;
//     peo.y+=peo.vy; 
//     // if(peo.vy<=1+Math.random()*0.5) peo.vy+=1;//驱动力
//     //v1
//     // for(let ii in people){
//     //     if(i==ii) continue;
//     //     peoI = people[ii];
//     //     if(distance(peo,peoI) <2){//发生碰撞
//     //             //peo.vx=(peoI.vx<0?1:-1)*Math.max(Math.abs(peo.vx),0.5);
//     //             peo.vx=0;
//     //             if(peo.y<peoI.y)peo.vy=0;
//     //     }
//     // }
//     let accuracy = 64;
//     let acuR = Math.PI/accuracy/2;
//     let minsit=0;let minWt=doubleMax;
//     for(let sitk =acuR;sitk<=Math.PI;sitk+=acuR){
//         let res = 0;
        
//         for(let ii in people){
//             let peoI = people[ii];
//             if(people[ii] == null) continue;
//             if(i == ii || peoI.y-1<= peo.y || ((distance(peo,peoI)>2))) continue;
//             //console.log(Math.abs(peo.x-peoI.x)<0.1);

//             res+=1/(Math.abs(sitaGiver(peoI.x-peo.x,peoI.y-peo.y)-sitk)*distance(peoI,peo));
//         }
//         res+=1/(Math.abs((Math.PI-sitk)*peo.x))*0.1;
//         res+=1/(Math.abs((sitk)*(holeMaxX-peo.x)))*0.1;
//         // console.log(i+" "+sitk+" "+res)
//         if(res>=0 && res<minWt){
//             minsit = sitk;
//             minWt = res;
//         }
//         if(res ==0){//轨道修正
//             minsit = Math.PI/2;
//             minWt = Math.random()*0.5;
//             break;
//         }
//     }
//     //Math.sqrt(peoI.vx*peoI.vx+peoI.vy*peoI.vy);
//     let vabs = Math.min(Math.max(0.1/minWt,0.1),1);
//     //console.log(minWt);
//     let oldSita =sitaGiver(peo.vx,peo.vy);
//     minsit = oldSita+(minsit-oldSita)*0.5;
//     peo.vx = vabs*Math.cos(minsit);
//     peo.vy = vabs*Math.sin(minsit);
//     // if(peo.x<=1){
//     //     peo.vx=0.5;
//     // }
//     // if(peo.x>=7){
//     //     peo.vx=0.5;
//     // }

// }