/*jslint browser: true*/
/*global $*/
/*global document*/
/*global console */
/*jslint strict: false */

// global variables start
var allDots;

var animationDuration = 300;

var scaleFactor = 100;
var dotScale1 = 0.78;
var dotScale23 = 0.92;
var dotScale45 = 1;
var dotScale6789 = 1.13;

var dot0Init = [ 0.45,      0, dotScale45];
var dot1Init = [-2.17, -0.68, dotScale1];
var dot2Init = [-0.72, -1.15, dotScale23];
var dot3Init = [-1.18,   0.4, dotScale23];
var dot4Init = [  0.8, -1.53, dotScale45];
var dot5Init = [-0.05,  1.54, dotScale45];
var dot6Init = [ 2.46, -1.96, dotScale6789];
var dot7Init = [ 2.03,  -0.4, dotScale6789];
var dot8Init = [  1.6, 1.186, dotScale6789];
var dot9Init = [  1.2,  2.73, dotScale6789];

var dotInit = [
    dot0Init,
    dot1Init,
    dot2Init,
    dot3Init,
    dot4Init,
    dot5Init,
    dot6Init,
    dot7Init,
    dot8Init,
    dot9Init 
];

/* array of arrays. dotlocations[n] returns array 
 *      dotlocations[n][0] = dotn left
 *      dotlocations[n][1] = dotn top
 *      dotlocations[n][2] = dotn diameter
 */
var dotLocations = [];
//close


$(document).ready(function () {
    allDots = $(".dot");
    placeDotsandGlow();
    sizeBassDrummer();
    addEventListeners();

});

// place dots functions start
function placeDotsandGlow() {
    var allGlow = $(".glow");

    var position = $("#dot0").position();
    for(var i = 0; i < allDots.length; i++) {
        placeDot(i, allDots[i].id, position.left, position.top);
    }

    for(var n = 0; n < allGlow.length; n++) {
        placeGlow(n, allGlow[n].id, position.left, position.top);
        console.log(allGlow[n].id);
    }
}
function placeDot(id, dotid, offsetLeft, offsetTop) {
   var dotStat = dotInit[id];
    dotLocations[dotLocations.length] = [dotStat[0] * scaleFactor + offsetLeft,
                                         dotStat[1] * scaleFactor + offsetTop,
                                         dotStat[2] * scaleFactor];
    
    setDot(id, false);
}
function placeGlow(id, dotid, offsetLeft, offsetTop) {
    var dotStat = dotInit[id];
    var dot = $("#" + dotid); 
    var localSF = 7;
    if (id == 0) {
        localSF = 20;
    }
    dot.css({
        "left": (dotStat[0] * scaleFactor + offsetLeft)+'px',
        "top": (dotStat[1] * scaleFactor + offsetTop)+'px',
    });
    
    setCircle(dot, localSF * scaleFactor * dotStat[2], false);
}
//close 

/**
 * sets a jquery elem into a circle
 * @param { jQuery obj} obj     the div you are setting
 * @param { int} diam   diameter
 * @param { bool} animate   should this be animated or not
 */
function setCircle(obj, diam, animate) {
    if (animate) {
        obj.animate({
            height: diam + 'px',
            width: diam + 'px',
            borderRadius: (diam /2) + 'px'
        }, { duration: animationDuration, queue: false });
    } else {
        obj.height(diam);
        obj.width(diam);
        obj.css({
            "border-radius": (diam / 2) + 'px'
        });
    }
   
}

/**
 * sets dot n to its first location
 * @param {int} n   the number of the dot you want to set
 */
function setDot(n, animate) {
    var dotStat = dotLocations[n];
    var dot = $("#dot" + n);
    
    if (animate) {
        dot.animate({
            left: dotStat[0]+'px',
            top: dotStat[1]+'px',
        }, { duration: animationDuration, queue: false });

        //setCircle(dot, dotStat[2], true);
    } else {
        dot.css({
            "left": dotStat[0]+'px',
            "top": dotStat[1]+'px',
        });

        setCircle(dot, dotStat[2], false);
    }
   
    
}

function addEventListeners() {
    $(".dot").mouseenter(function() {
        mOver(this.id);
    });

    $(".dot").mouseleave(function() {
        mLeave(this.id);
    });
}

function mOver(id) {
    var dot = $('#' + id);
    
    var size = dot.width();
    setCircle(dot, size * 1.2, true);
    dot.children().animate({
        opacity: 1
    }, { duration: animationDuration, queue: false });
    
    /*
    if (id[3] == 1) {
        dot.css("background-color", "rgba(255, 255, 255, 0)");
    }
    */
    
    
    for (var i = 0; i < allDots.length; i++) {
        moveAway(allDots[i].id, dot, 0.05);
    }
}

function mLeave(id) {
    var dot = $('#' + id);
    
    setCircle(dot, dotLocations[id[3]][2], true);
    
    dot.children().animate({
        opacity: 0
    }, { duration: animationDuration, queue: false });
    
    for (var i = 0; i < allDots.length; i++) {
        setDot(i, true);
    }
    
    
}

/**
 * move me away from stinky
 * @param {jQuery div} me : the object that is moving away
 * @param {jQuery div} stinky : the object away from which it is moving
 */
function moveAway(meid, stinky, scale) {
    //calculate vector from stinky->me
    var me = $("#" + meid);
    var x = me.position().left - stinky.position().left;
    var y = me.position().top - stinky.position().top;
    
    //redraw me
    me.animate( {
        left: '+=' + (x * scale) + 'px',
        top: '+=' + (y * scale) + 'px'
    }, { duration: animationDuration, queue: false });
    
}

function sizeBassDrummer() {
    var img = $("#dot8 img");
    var BDimgSF = dotLocations[8][2] / 250;
    img.css({
        height: 729 * BDimgSF,
        width: 446 * BDimgSF,
    })
}

