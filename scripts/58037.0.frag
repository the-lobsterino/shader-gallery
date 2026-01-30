#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 yellow = vec3(1.0, 1.0, 0.0);
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

void eye(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i) {
	
	float l = length(p - offset);
    if(l < size){
        i = color;
    }
}

void main( void ) {
	
	    vec3 destColor = white;
	vec3 destPac_Man = yellow;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    circle (p, vec2(-0.5, 0.5), 0.25, yellow, destColor);
	
	eye(p, vec2(-1.0, 1.0), 9.0, black, destPac_Man);
	
    gl_FragColor = vec4(destColor, 1.0);
}