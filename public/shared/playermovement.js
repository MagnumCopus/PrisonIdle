
(function(exports) {

    var maxHorizontalSpeed = 4;
    var horizontalAcc = .15;
    var gravity = .01;
    var groundFriction = 1.15;
    var airFriction = .062;

    exports.applyInput = function(input, dTime, state, dimensions){
        if (input.left && !input.right) state = moveLeft(dTime, state, dimensions);
        if (input.right && !input.left) state = moveRight(dTime, state, dimensions);
        if (input.up) state = jump(dTime, state, dimensions);

        applyGravity(dTime, state);
        if (checkOnFloor(state, dimensions) && ((input.right && input.left) || (!input.right && !input.left))) applyFriction(input, dTime, state, dimensions);

        state = checkHorizontalBounds(state, dimensions);
        state = checkVerticalBounds(state, dimensions);

        return state;
    };

    // Checking for wall collisions
    var checkHorizontalBounds = function(state, dimensions){
        state.loc.x += state.vel.x;

        return state;
    }

    // Checking for floor and roof collisions
    var checkVerticalBounds = function(state, dimensions) {
        if (checkOnFloor(state, dimensions)) {
            state.vel.y = 0;
            state.loc.y = 720 - dimensions.height;
        } else {
            state.loc.y += state.vel.y;
        }

        return state;
    }

    var checkOnFloor = function(state, dimensions) {
        if (state.loc.y + dimensions.height + state.vel.y >= 720) return true;
        else return false;
    }

    var applyGravity = function(dTime, state) {
        state.vel.y += gravity * dTime;

        return state;
    }

    var applyFriction = function(input, dTime, state, dimensions) {
        if (state.vel.x >= -groundFriction && state.vel.x <= groundFriction) state.vel.x = 0;
        else state.vel.x /= groundFriction * dTime;

        return state;
    }

    var moveLeft = function(dTime, state, dimensions) {
        if (checkOnFloor(state, dimensions)) state.vel.x -= horizontalAcc * dTime;
        else state.vel.x -= horizontalAcc / 16 * dTime;
        if (state.vel.x < -maxHorizontalSpeed) state.vel.x = -maxHorizontalSpeed;

        return state;
    }

    var moveRight = function(dTime, state, dimensions) {
        if (checkOnFloor(state, dimensions)) state.vel.x += horizontalAcc * dTime;
        else state.vel.x += horizontalAcc / 16 * dTime;
        if (state.vel.x > maxHorizontalSpeed) state.vel.x = maxHorizontalSpeed;

        return state;
    }

    var jump = function(dTime, state, dimensions){
        if (checkOnFloor(state, dimensions)) {
            state.vel.y = -4;
        }

        return state;
    }
})(typeof exports === 'undefined'? this['playermovement']={}: exports);