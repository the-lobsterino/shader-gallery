#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define black vec3(0.0)
const vec3 yellow  = vec3(1.0, 0.75, 0.0);
const vec3 green = vec3(0.0, 1.0, 0.0);
const vec3 pink  = vec3(1.0, 0.0, 0.8);
float t = time;
vec2 r = resolution;


void circle(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i){
	float l = length(p - offset);
    if(l < size){
        i = color;
    }
}

void ellipse(vec2 p, vec2 offset, vec2 prop, float size, vec3 color, inout vec3 i){
    vec2 q = (p - offset) / prop;
    if(length(q) < size){
        i = color;
    }
}

void main(void){
    vec3 destColor = black;
    vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
    vec2 q = mod(p, 0.5) - 0.25;
    
 for(float i = 0.0; i < 8.0; i++){
 	float s = sin((t + i * 0.785398));
    float c = cos((t + i * 0.785398));
    vec2 m = q * mat2(c, -s, s, c);
 	ellipse(m, vec2(0.0, 0.1), vec2(0.3, 1.0), 0.15, pink, destColor);
 }
 circle (q, vec2(0.0,  0.0), 0.05, yellow, destColor);
    gl_FragColor = vec4(destColor, 1.0);
}