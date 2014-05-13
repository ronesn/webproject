
/*********************global variables**********************************************************/
var pageArray=["index.html","index2.html","explanation.html","aqi.html","china.html"];
var background=["print-1.jpg","print-2.jpg","print-3.jpg","print-4.jpg","print-5.jpg","print-6.jpg"];
var cities=["Beijing","Shanghai","HongKong","Guangzhou","Shenyang","Shenzhen","Nanyou","Wuhan"];
var months=["januar","february","march","april","may","june","july","august","september","october","november","december"];
var bigLogo=["logo-AQI-big-1.jpg","logo-AQI-big-2.jpg","logo-AQI-big-3.jpg","logo-AQI-big-4.jpg","logo-AQI-big-5.jpg","logo-AQI-big-6.jpg"];
var smallLogo=
["logo-AQI-small-1.jpg","logo-AQI-small-2.jpg","logo-AQI-small-3.jpg","logo-AQI-small-4.jpg","logo-AQI-small-5.jpg","logo-AQI-small-6.jpg"];
var index=0;
var cityIndex=0;
var xmlLink="http://aux.shenkar.ac.il/media/dev/dev_101/includes/aqi.xml";

//Data object
function Data()
{	
	this.city=getCity();
	this.date=getDate().split(" ");
	this.month=this.date[1];
	this.day=this.date[0];
	var h=getHour();
	if(h)
		this.hour=h.split(" ");
}

/*********************function**********************************************************/

// in the first page:load the page in steps
function loadIndex()
{		
	var obj=document.getElementById('index');
	var side=document.getElementsByTagName('aside')[0];
	var nodes=obj.childNodes;
	
	setTimeout(function(){
			for(var i=1;i<nodes.length; i+=2) 
				nodes[i].style.display = "block";
			document.getElementById('lith').style.marginLeft="-40%";
			},2000);
}


//	function getPage: get page index according to pages array	
function getPage()
{
	var pathname = window.location.pathname;
	  
	for(var i=0;i<pageArray.length;i++)
   {	
		if ( (pathname.indexOf(pageArray[i])) > -1 )
			return i;
   }
	return -1;
}

/*	pages 1-6 navigate with left and right arrows	
*	37 - left, 38 - up, 39 - right, 40 - down 		*/		
$(document).keydown(function(e){
	
	var page=getPage();
	if (page<0)
		return;
	// keyCode == 39 ,right->move forward
    if ((e.keyCode == 39)&&(page<pageArray.length)) 
	{
		switch(page){
			case 1:{
				if(index<4){
					var children=$(".index2").children();
					children.eq(index++).css("display", "none");
					children.eq(index).css("display", "block");
				}
				else //load next page
					window.location = './'+pageArray[page+1];
			}break;
			case 2:{
				if(index<5){
					var children=$(".index2").children();
					children.eq(index++).css("display", "none");
					children.eq(index).css("display", "block");
					$('#wrapperIndex3').css('background-image', 'url(./includes/images/'+background[index]+')');
					}
				else //load next page
					window.location = './'+pageArray[page+1];
			}break;
			case 4:{
				$('img').css("display", "none");
				$('#link').css("display", "block");
				}break;
			default:window.location = './'+pageArray[page+1];
		}	
			
       return false;
    }
	// keyCode == 37 ,left->move backward
	if ( (e.keyCode == 37)&&(page>0) ) { 
		if((page==2)&&(index>0)){
			var children=$(".index2").children();
			children.eq(index--).css("display", "none");
			children.eq(index).css("display", "block");
		}
		else
		{
			if((page==4)&&(index>0)){
				var children=$(".index2").children();
				children.eq(index--).css("display", "none");
				children.eq(index).css("display", "block");
				}
			else
				window.location = './'+pageArray[page-1];
		}
       return false;
    }
});
//return the first city
function getCity(){
	var root=document.getElementById('topLeft').childNodes;//innerHTML
	return root[1].childNodes[1].text;
}
//return the chosen date
function getDate(){
	var root=document.getElementById('topRight').childNodes;//innerHTML
	return root[1].childNodes[1].text;
}
//return the chosen hour
function getHour(){
	var root=document.getElementById('bottomLeft').childNodes;//innerHTML
	return root[1].childNodes[0].text;
}
//get the present time and disply it
function setOnlineDate()
{
	var today = new Date();
	var year=today.getFullYear();
	var day = today.getDate();
	var month = months[today.getMonth()]; 
	var date= day+" "+month+" "+year;
	
	var hour=today.getHours();
	if (hour<12)
		hour+=" am";
	else{
		hour=(hour*1)-12;
		hour+=" pm";
	}
	
	
	//display the present date
	var root=document.getElementById('topRight').childNodes;
	root[1].childNodes[1].innerHTML=date;
	var list=root[1].childNodes[3].getElementsByTagName("a");
	for(var i =0;i<list.length;i++)
	{	
		date= (day-i-1)+" "+month+" "+year;
		list[i].innerHTML=date;
	}
	
	var pathname = window.location.pathname;
	if ( pathname.indexOf("now") > -1 ){
		root=document.getElementById('bottomLeft').childNodes;
		root[1].childNodes[0].innerHTML=hour;
	}
}

//get xml file ,return the aqi value
function getAqi(xmlhttp)
{
	var date=new Data(); 	//data object
	
	var city=xmlhttp.responseXML.documentElement.getElementsByTagName(date.city);
	var month=city[0].getElementsByTagName(date.month);
	var days=month[0].getElementsByTagName("day");
	var aqi=days[(date.day)-1].getElementsByTagName(date.hour[1])[0].getElementsByTagName("hour")[(date.hour[0])-1];
	
	return aqi.getElementsByTagName("value")[0].textContent;	
}

//fit image source to the aqi value
function getSmallImg(aqi)
{
	var newSrc="includes//images/";
	if(aqi<51)
		newSrc+=smallLogo[0];
	if((aqi>50)&&(aqi<101))
		newSrc+=smallLogo[1];
	if((aqi>100)&&(aqi<151))
		newSrc+=smallLogo[2];
	if((aqi>150)&&(aqi<201))
		newSrc+=smallLogo[3];
	if((aqi>200)&&(aqi<301))
		newSrc+=smallLogo[4];
	if(aqi>300)
		newSrc+=smallLogo[5];
	return newSrc;	
}
//fit image source to the aqi value
function getBigImg(aqi)
{
	var newSrc="includes//images/";
	if(aqi<51)
		newSrc+=bigLogo[0];
	if((aqi>50)&&(aqi<101))
		newSrc+=bigLogo[1];
	if((aqi>100)&&(aqi<151))
		newSrc+=bigLogo[2];
	if((aqi>150)&&(aqi<201))
		newSrc+=bigLogo[3];
	if((aqi>200)&&(aqi<301))
		newSrc+=bigLogo[4];
	if(aqi>300)
		newSrc+=bigLogo[5];
	return newSrc;	
}
//change the display city name
function setCity(flag,str) {
	var root=document.getElementById('topLeft').childNodes;//innerHTML
	var txt=root[1].childNodes[1].text;
	var temp=txt;
	root[1].childNodes[1].innerHTML=str.text;
	str.innerHTML=txt;
	
	if(flag==0) //calc and display the new aqi
		loadXMLDoc();
	else 
		loadDayXml(1);
}
//change the display date name
function setDate(flag,str) {
	var root=document.getElementById('topRight').childNodes;//innerHTML
	var txt=root[1].childNodes[1].text;
	var temp=txt;
	root[1].childNodes[1].innerHTML=str.text;
	str.innerHTML=txt;
	
	if(flag==0) //calc and display the new aqi
		loadXMLDoc();
	else 
		loadDayXml(1);
}
// function homePos: set the home link position randomly
function homePos(){
	var random=(Math.random()*700);
	random+=100;
	$('#home').css(
	{'left':random+'px'});
	$("#home").css("display", "block");
}


 //loadNow: get the clicked link set localStorage by city index
 //			load and move to "now.html" page
function loadNow(city){

	if(typeof(Storage)!=="undefined")
		localStorage.city=Number(city);
	else
		alert("Sorry, your browser does not support web storage...");

	window.location ="./now.html";	
}

// in 'onLoadNow.html':show current date and chosen city 
function onLoadNow() {
	
	homePos(); //position the home link
	setOnlineDate();// get the current time
	
	if(localStorage.city>0) //swap the chosen city with the first(beijing)
	{
		var root=document.getElementById('topLeft').childNodes;//
		var newCity=cities[localStorage.city];
		root[1].childNodes[1].innerHTML=newCity;
		root[1].childNodes[3].childNodes[localStorage.city*2-1].childNodes[0].innerHTML="Beijing";
	}
	loadXMLDoc();
}

//open xml file, display the suitable aqi value and image
function loadXMLDoc(){

	var xmlhttp=new XMLHttpRequest();

	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var aqi=getAqi(xmlhttp);
			var txt=aqi+" aqi";	
			//add the aqi value
			document.getElementById('bottomRight').innerHTML=txt;
			//change the src img to the suit aqi value
			var newSrc=getBigImg(aqi);
			$("img").attr("src",newSrc);			
		}
	}
	xmlhttp.open("GET",xmlLink,true);
	xmlhttp.send();
}

//function loadDayXml:
//		open xml file change each image to the suit image 
//		calc and display the avrege aqi
function loadDayXml(flag) {

	var sum=0;
	var aqi=0;
	if(flag==0){
		homePos();
		setOnlineDate();
	}
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var imageArray=$("img"); //image array
			var dat=new Data();
			var city=xmlhttp.responseXML.documentElement.getElementsByTagName(dat.city);
			var month=city[0].getElementsByTagName(dat.month);
			var days=month[0].getElementsByTagName("day");
			var day=days[(dat.day)-1].getElementsByTagName("hour");;
			for( var i=0;i<24;i++)
			{
				aqi=day[i].getElementsByTagName("value")[0].textContent;
				var newSrc=getSmallImg(aqi);
				imageArray[i].src=newSrc;
				sum+=aqi*1;
			}
			var avr=Math.floor(sum/24); //calc the avrage aqi
			document.getElementById('bottomRight').innerHTML=avr+" AQI average";
		}
	}
	xmlhttp.open("GET",xmlLink,true);
	xmlhttp.send();	
}



/*
function load()
{
	
	document.getElementById('wrapperCities').style.backgroundPosition='-760px -1000px';	
	setTimeout(setleft(-760), 0);
	setTimeout(setDown(-1000), 3000);
	setTimeout(setRight(-1460), 6000);
	setTimeout(setup(-1200), 10000);
}
function setleft (px)
{
  return function ()
  {
  var pos=px+"px -1000px";
	document.getElementById('wrapperCities').style.backgroundPosition=pos;
	if (px > -1460) 
		setTimeout(setleft(px - 5), 2);
  }
}

function setDown (px)
{
  return function ()
  {
	var pos="-1460px "+px+"px";
	document.getElementById('wrapperCities').style.backgroundPosition=pos;
	if (px >-1200) 
		setTimeout(setDown(px -2), 2);
  }
}
function setRight (px)
{
  return function ()
  {
	var pos=px+"px -1200px";
	document.getElementById('wrapperCities').style.backgroundPosition=pos;
	if (px < -760) 
		setTimeout(setRight(px + 5), 2);
  }
}
function setup (px)
{
  return function ()
  {
	var pos="-760px "+px+"px";
	document.getElementById('wrapperCities').style.backgroundPosition=pos;
	if (px <-1000) 
		setTimeout(setup(px +2), 2);
  }
}*/

/*
$(function(){
	$('.explan').bind('swipe',function(event){
		$(".explan").hide();
	});
});
function myFunction()
{
	$(".explan").hide();
	$("#link").css("display", "block");
}
function loadUrl(newLocation)
{
	window.location.href = newLocation;
}
*/