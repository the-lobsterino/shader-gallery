#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rectangle(vec4 borders, vec2 coords){
    vec4 coordVals = vec4(coords.x, 1. - coords.x, 1. - coords.y, coords.y);//left, right, up, down
    vec4 vals = step(borders, coordVals);
    float val = (vals.x * vals.y * vals.z * vals.w);
    
    return val;
}

float rectangleOutline(vec4 borders, vec2 coords, float thickness){
    vec4 realBorders = vec4(borders.x  + thickness, borders.y + thickness,
                            borders.z + thickness, borders.w + thickness);
     
    return abs(rectangle(borders, coords) * (rectangle(realBorders, coords) - 1.));
}

vec2 tile(vec2 coords, float zoom, bool brick){ //tiles the initial picture if set to the coordinates
    coords *= zoom;
    float t = time * .5;
    if (brick){
        if( fract(t)>0.5 ){
            if (fract( coords.y * 0.5) > 0.5){
                coords.x += fract(t)*2.0;
            } else {
                coords.x -= fract(t)*2.0;
            } 
        } else {
            if (fract( coords.x * 0.5) > 0.5){
                coords.y += fract(t)*2.0;
            } else {
                coords.y -= fract(t)*2.0;
            } 
        }
    }
    return fract(coords);
}
vec2 rotate2D(vec2 coords, float angle){ //rotates frame if set to coordinates
    coords -= 0.500;
    coords =  mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle)) * coords;
    coords += 0.5;
    return coords;
}


void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    
    st = tile(st, 5., true);
    st = rotate2D(st, time);
    
    float t = abs(sin(time));
    float c = rectangleOutline(vec4(.2), st, 0.033);	  
          
    gl_FragColor = vec4(0.,0.0, c ,1.0);
}