class priority_queue{
    constructor() {
        this.heap = [];
    }
    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1;
    }
    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2;
    }
    getParentIndex(childIndex) {
        return Math.floor((childIndex - 1) / 2);
    }
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }
    swap(indexOne, indexTwo) {
        const temp = this.heap[indexOne];
        this.heap[indexOne] = this.heap[indexTwo];
        this.heap[indexTwo] = temp;
    }
    peek() {
        if (this.heap.length === 0) {
            return null;
        }
        return this.heap[0];
    }
    remove() {
        if (this.heap.length === 0) {
            return null;
        }
        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return item;
    }
    add(item) {
        this.heap.push(item);
        this.heapifyUp();
    }
    comapre(i,j){
        if(this.heap[i][1][0]<this.heap[j][1][0]){
            return true;
        }
        else if(this.heap[i][1][0]===this.heap[j][1][0]){
            if(this.heap[i][1][1]<this.heap[j][1][1]){
                return true;
            }
        }
        return false;
    }
    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && !this.comapre(this.getParentIndex(index),index)){
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }
    heapifyDown() {
        let index = 0;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.comapre(this.getRightChildIndex(index),this.getLeftChildIndex(index))){
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (this.comapre(index,smallerChildIndex)) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }
}
function GetMap(){
    let pin=document.querySelector('.pin');
    let add=document.querySelector('.add');
    let calculate=document.querySelector('.calculate');
    let addition=document.querySelector('.dummy');
    let destinations=[];
    let start;
    let l=null;
    let start_pin=null;
    let empty=[];
    let ids=[];
    let t=[];
    let len=0;
    let key='ArYXHm8boUj6BseNmv5qelFJOscJVnd2jA-rtNC-a9VqkKzLdbKrxSuC8BYEym8o';
    let map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: key,
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 10,
        customMapStyle:{
            "version": "1.*",
            "settings":{
                "landColor":"#e2ece9"
            },
            "elements": {
              "baseMapElement": {
                "fillColor": "#00EDF5E1", 
                "fontWeight": "normal"
              },
              "water": {
                "fillColor": "#cddafd"
              }
            }
          }
    });
    const createpin=(arr,sw)=>{
        var location=new Microsoft.Maps.Location(arr[0],arr[1]);
        if(sw){
            var pin= new Microsoft.Maps.Pushpin(location,{color:'#40916c'});
            if(start_pin){
                map.entities.remove(start_pin);
            }
            start=arr;
            start_pin=pin;
            map.entities.push(start_pin);
        }
        else{
            var pin= new Microsoft.Maps.Pushpin(location,{text:(destinations.length+1).toString(),color:"#d62828"});
            map.entities.push(pin);
            destinations.push(pin);
        }
    }
    const final_addition=()=>{
        addition.innerHTML="";
        addition.appendChild(add);
        addition.appendChild(calculate);
    }
    const update_destination=(place)=>{
        place=place.toUpperCase();
        var destilist=document.querySelector('.destinationlist');
        var id;
        if(empty.length===0){
            len++;
            id=len.toString();
        }
        else{
            id=empty.pop();
        }
        if(destinations.length===0){
            destilist.innerHTML=`<div class=location><div class=icon><i id=${id}></i></div><p class=destination>${place}</p></div>`;
        }
        else{
            destilist.innerHTML+=`<div class=location><div class=icon><i id=${id}></i></div><p class=destination>${place}</p></div>`;
        }
        document.getElementById(id).className="fa-solid fa-location-crosshairs";
        final_addition();
    }
    const pincor=(address,sw=-1)=>{
        var encoded=encodeURI(address);
        var link='https://dev.virtualearth.net/REST/v1/Locations?q='+encoded+'&key='+key;
        fetch(link).then((res)=>{
            return res.json();
        }).then((obj)=>{
            if(obj.statusDescription!=="OK"){
                throw new Error('Invalid request');
            }
            var resource=obj.resourceSets[0].resources;
            if(resource.length>0){
                var point=resource[0].point;
                var coordinates=point.coordinates;
                if(sw){
                    update_destination(address);
                    createpin(coordinates,0);
                }
                else{
                    var start_location=document.querySelector('.start');
                    var place=address.toUpperCase();
                    start_location.innerHTML=`<div class=location><div class=icon><i id=0></i></div><p class=destination>${place}</p></div>`;
                    document.getElementById("0").className="fa-solid fa-location-crosshairs";
                    createpin(coordinates,1);
                    map.setView({"center":start_pin.getLocation(),
                        "zoom":10               
                    });
                }
            }
            else{
                alert('No such Location found');
                final_addition();
            }
        }).catch((err)=>{
            alert(err.message);
        })
    }
    const draw=(c,final)=>{
        var loc=[];
        for(var i=0;i<c.length;i++){
            loc.push(new Microsoft.Maps.Location(c[i][0],c[i][1]));
        }
        var line=new Microsoft.Maps.Polyline(loc,{
            "strokeThickness":3,
            "strokeColor":"#3a86ff"
        });
        if(l){
            map.entities.remove(l);
        }
        l=line;
        map.entities.push(line);
        for(var i=0;i<final.length;i++){
            var id=map.entities.indexOf(destinations[final[i]-1]);
            var h=Math.floor(t[i]/60);
            var m=Math.ceil(t[i]-h*60);
            var str="";
            if(h){
                str+=h+" Hours ";
            }
            if(m){
                str+=m+" Minutes";
            }
            console.log(str);
            map.entities.get(id).setOptions({text:(i+1).toString(),title:str});
        }
    }
    const direction=(final)=>{
        var temp="";
        temp+="wayPoint.1="+start;
        for(var i=0;i<final.length;i++){
            temp+="&wayPoint."+(i+2)+"="+destinations[final[i]-1].getLocation().latitude+','+destinations[final[i]-1].getLocation().longitude;
        }
        var link="https://dev.virtualearth.net/REST/v1/Routes?"+temp+"&routeAttributes=routePath&key="+key;
        fetch(link).then((res)=>{
            return res.json();
        }).then((obj)=>{
            if(obj.statusDescription!=="OK"){
                throw new Error('Invalid request');
            }
            var resource=obj.resourceSets[0].resources;
            var route=resource[0].routePath;
            var c=route.line.coordinates;
            draw(c,final);
        }).catch((err)=>{
            alert(err.message);
        })
    }
    const modified_dijkstra=(graph,num_nodes)=>{
        var dist=[];
        var vis=[];
        var par=[];
        var taken=[];
        for(var i=0;i<num_nodes;i++){
            dist.push([]);
            vis.push([]);
            par.push([]);
            taken.push(0);
            for(var j=0;j<(1<<num_nodes);j++){
                dist[i].push([]);
                vis[i].push([]);
                par[i].push([]);
                vis[i][j]=0;
                dist[i][j]=[1000000000,1000000000];
                par[i][j]=[i,j];
            }
        }
        dist[0][1]=[0,0];
        var q=new priority_queue();
        q.add([[0,1],[0,0]]);
        while(q.heap.length!==0){
            var node=q.remove();
            var x=node[0][0];
            var y=node[0][1];
            if(vis[x][y]){
                continue;
            }
            vis[x][y]=1;
            for(var i=0;i<graph[x][y].length;i++){
                var u=graph[x][y][i][0][0];
                var v=graph[x][y][i][0][1];
                var w=graph[x][y][i][1][0];
                var d=graph[x][y][i][1][1];
                if(dist[x][y][0]+w<dist[u][v][0]){
                    dist[u][v][0]=w+dist[x][y][0];
                    dist[u][v][1]=d+dist[x][y][1];
                    par[u][v]=[x,y];
                    q.add([[u,v],dist[u][v]]);
                }
                else if(dist[x][y][0]+w===dist[u][v][0]&&dist[x][y][1]+d<dist[u][v][1]){
                    dist[u][v][1]=d+dist[x][y][1];
                    par[u][v]=[x,y];
                    q.add([[u,v],dist[u][v]]);
                }
            }
        }
        taken[0]=1;
        var final=[];
        t=[];
        var x=1;
        var y=(1<<num_nodes)-1;
        for(var i=1;i<num_nodes;i++){
            if(dist[i][y][0]<dist[x][y][0]){
                x=i;
            }
            else if(dist[i][y][0]===dist[x][y][0]&&dist[i][y][1]<dist[x][y][1]){
                x=i;
            }
        }
        while(x){
            if(!taken[x]){
                final.push(x);
                taken[x]=1;
                t.push(dist[x][y][1]);
            }
            var temp=par[x][y];
            x=temp[0];
            y=temp[1];
        }
        final.reverse();
        t.reverse();
        console.log(t);
        direction(final);
    }
    const preprocess=(origin_nodes,result)=>{
        var num_nodes=origin_nodes.length;
        var graph=[];
        for(var i=0;i<num_nodes;i++){
            graph.push([]);
            for(var j=0;j<(1<<num_nodes);j++){
                graph[i].push([]);
            }
        }
        for(var i=0;i<result.length;i++){
            var x=result[i].originIndex;
            var y=result[i].destinationIndex;
            var distance=result[i].travelDistance;
            var time=result[i].travelDuration;
            if(distance!==0&&time!==0){
                for(var j=0;j<(1<<num_nodes);j++){
                    graph[x][j].push([[y,j|(1<<y)],[time,distance]]);
                }
            }
        }
        modified_dijkstra(graph,num_nodes);
    }
    const fetchmatrix=()=>{
        var temp="";
        temp+=start;
        for(var i=0;i<destinations.length;i++){
            temp+=";"+destinations[i].getLocation().latitude+','+destinations[i].getLocation().longitude;
        }
        var link="https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins="+temp+"&destinations="+temp+"&travelMode=driving&key="+key;
        fetch(link).then((res)=>{
            return res.json();
        }).then((obj)=>{
            if(obj.statusDescription!=="OK"){
                throw new Error('Invalid Request');
            }
            var resource=obj.resourceSets[0].resources;
            var origin_nodes=resource[0].origins;
            var result=resource[0].results;
            preprocess(origin_nodes,result);
        }).catch((err)=>{
            alert(err.message);
        })
    }
    const handleicon=(id)=>{
        if(id==='0'){
            console.log(start);
            map.setView({"center":start_pin.getLocation(),
            "zoom":10});
            return ;
        }
        map.setView({"center":destinations[id-1].getLocation(),
        "zoom":10});
    }
    pin.addEventListener("click",e=>{
        var loc=document.querySelector('.search');
        var address=loc.value;
        pincor(address,0);
    });
    add.addEventListener("click",e=>{
        addition.innerHTML="<input type=text class=new_desti /><button class=new_add>ADD</ button><button class=cancel>CANCEL</button>"
        var new_desti=document.querySelector('.new_desti');
        var cancel=document.querySelector('.cancel');
        var new_add=document.querySelector('.new_add');
        new_add.addEventListener("click",e=>{
            var address=new_desti.value;
            pincor(address,1);
        });
        cancel.addEventListener("click",e=>{
            addition.innerHTML="";
            addition.appendChild(add);
            addition.appendChild(calculate);
        })
    });
    calculate.addEventListener("click",e=>{
        if(!start||destinations.length===0){
            if(!start&&destinations.length===0){
                alert('Enter a start location and  add atleast one destination.');
            }
            else if(!start){
                alert('Enter the start location.');
            }
            else if(destinations.length===0){
                alert('Add atleast one destination.');
            }
        }
        else{
            fetchmatrix();
        }
    });
    document.querySelector('body').addEventListener('click',e=>{
        if(e.target.className==="fa-solid fa-location-crosshairs"){
            handleicon(e.target.id);
        }
    })
}