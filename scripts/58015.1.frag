#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 red   = vec3(1.0, 0.0, 0.0);
const vec3 green = vec3(0.0, 1.0, 0.0);
const vec3 blue  = vec3(0.0, 0.0, 1.0);
const vec3 black = vec3(0.0, 0.0, 0.0);
#define white vec3(1.0)

void circle(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i){
    float l = length(p - offset);
    if(l < size){
        i = color;
    }
}

void rect(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i){
    vec2 q = (p - offset) / size;
    if(abs(q.x) < 1.0 && abs(q.y) < 1.0){
        i = color;
    }
}

void rectangle(vec2 p, vec2 offset, float size, vec2 tateyoko, vec3 color, inout vec3 i){
    vec2 q = (p - offset) / size;
    if(abs(q.x) < tateyoko.x && abs(q.y) < tateyoko.y){
        i = color;
    }
}

void ellipse(vec2 p, vec2 offset, vec2 prop, float size, vec3 color, inout vec3 i){
    vec2 q = (p - offset) / prop;
    if(length(q) < size){
        i = color;
    }
}

void main( void ) {
	
	    vec3 destColor = white;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    circle (p, vec2( -0.5,  0.5), 0.25, red, destColor);
    rect   (p, vec2( 0.5, -0.5), 0.25, green, destColor);
    ellipse(p, vec2(-0.5, -0.5), vec2(0.5, 1.0), 0.25, blue, destColor);
    rectangle(p,vec2(0.5,0.5),0.25,vec2(1.5,0.5),black,destColor);
    gl_FragColor = vec4(destColor, 1.0);
}