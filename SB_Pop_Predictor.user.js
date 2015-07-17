// ==UserScript==
// @name        SB Pop Predictor
// @namespace   PopPredictor
// @include     http://orion.pardus.at/game.php
//@updateURL https://raw.githubusercontent.com/sylos/PardusFWTickEstimate/master/SB_Pop_Predictor.user.js.js
//@downloadURL https://raw.githubusercontent.com/sylos/PardusFWTickEstimate/master/SB_Pop_Predictor.user.js.js
// @version     1.2
// @grant       none
//@description Calculates approximate number of ticks of food and water of a starbase based on
//visible quantities
// @include        *.pardus.at/starbase_trade.php
// @include        *.pardus.at/starbase.php
// ==/UserScript==


visible = true;
notVisible = false;

var food = 0; 
var energy = 1;
var water = 2;
var commodity;
var starbaseGoods;
var foodRow = "baserow1";
var waterRow = "baserow3";

function main()
{
	starbaseGoods = getStarbaseGoods();
	//printContents(starbaseGoods);
	printFW(starbaseGoods);
	//console.log("post");
}

function getStarbaseGoods()
{
	//devs are stupid and forgot to include an ID for neural tissue/stims. Good thing they're useless
	var maxNumSBGoods = 27;
	var sbGoods = new Array();
	
	for(var i=1;i<=maxNumSBGoods;i++)
	{
		
		var newCommodity = getCommodity(i);
		
		if (newCommodity == null)
		{
			continue;
		}
		
		sbGoods.push(newCommodity);
		
	}	
	
	return sbGoods;
}

function getCommodity(i)
{
	var amountIndex = 2;
	var rateIndex = 3;
	var newCommodity;
	var item = document.getElementById("baserow"+i);
	
	if(item == null)
	{
	 //console.log("item is null: "+ i);
	 return null;
	}
	
	
	var name = document.getElementById("buy"+i).innerHTML;
	//var parsedAmount = parseInt(item.childNodes[2].textContent);
	var parsedAmount  = parseInt(item.childNodes[amountIndex].textContent.replace(",", ""));
	var parsedConsumption = parseInt(item.childNodes[rateIndex].textContent.replace(",", ""));
	
	if(!item.getAttribute("style"))
	{
		
		 newCommodity = new commodity(name,parsedConsumption,visible,parsedAmount);
	}else
	{
		 newCommodity = new commodity(name,parsedConsumption,notVisible, parsedAmount);
	}
		
	return newCommodity;
}
function printContents(goods){
	for(var i = 0;i<goods.length;i++){
		console.log(goods[i].toString());
	}
}
function printFW(goods){
	var starbaseTitle = document.getElementsByTagName('h1')[0];
	var foodTick = goods[food].amount/Math.abs(goods[food].rate);
	var waterTick= goods[water].amount/Math.abs(goods[water].rate);;
	starbaseTitle.innerHTML += "<center>"+ goods[food].name + ": "+ foodTick.toFixed(2) + "</center>";
	starbaseTitle.innerHTML += "<center>"+ goods[water].name + ": "+ waterTick.toFixed(2)  +"</center>";
}

function printConsumption(commodity)
{
	var starbaseTitle = document.getElementsByTagName('h1')[0];
	var commodityString = "";
	for(var i = 0;i<commodity.length;i++){
		commodityString += i + ": " + commodity[i]+ " ";
	}
	console.log(commodityString);
	starbaseTitle.innerHTML += "<center>"+ commodityString + "</center>";
}

function commodity(name, rate, visibility,amount)
{
	this.name = name;
	this.rate = rate;
	this.amount = amount;
	this.visible = visibility;
	this.toString = function()
	{
		return this.name + ": " + this.rate;
	}
}

window.onload = main();