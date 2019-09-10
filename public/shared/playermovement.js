
(function(exports) {

    exports.movePlayer = function(input, dTime, loc){
        var speed = 4;

        var vel = {x: 0, y: 0};
        if (input.left) vel.x -= 1;
        if (input.up) vel.y -= 1;
        if (input.right) vel.x += 1;
        if (input.down) vel.y += 1;
        var dist = Math.sqrt(Math.pow(vel.x, 2) + Math.pow(vel.y, 2));
        if (dist > 0) {
            loc.x += vel.x / dist * speed;
            loc.y += vel.y / dist * speed;
        }
        return loc;
    };
})(typeof exports === 'undefined'? this['playermovement']={}: exports);