#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

////////////////
//Made by Mattias Selin, July 5 2019
//Based on a closed-eye hallucination (CEV) I had after eating mushrooms.
///////////////

uniform float time;
uniform vec2 resolution;

const vec2 I = vec2(0.0,1.0);
const float PI = 3.1415926;
const float TAU = 2.0*PI;

const float SQRT_3 = sqrt(3.0);
const mat2 ROTATION = mat2(cos(PI/3.0),-sin(PI/3.0),sin(PI/3.0),cos(PI/3.0));

vec2 cMult(in vec2 a, in vec2 b) {
	return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);
}

vec2 cConj(in vec2 a) {
	return vec2(a.x,-a.y);
}

vec2 cDiv(in vec2 a, in vec2 b) {
	return cMult(a,cConj(b))/dot(b,b);
}

vec2 c(in float r) {
	return vec2(r,0.0);
}

vec2 cExp(in vec2 val) {
	return exp(val.x)*vec2(cos(val.y),sin(val.y));
}

vec2 cSin(in vec2 val) {
	return cDiv(cExp(cMult(I,val))-cExp(cMult(-I,val)),2.0*I);
}

mat2 rot(in float angle) {
	return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float normSin(in float t) {
	return sin(t)*0.5+0.5;
}

float lerpSin(in float min, in float max, in float t) {
	return normSin(t)*(max-min)+min;
}

float everyOtherRow(in vec2 p, in float grid) {
	return step(mod(p.x,2.0*grid)/grid, 1.0);
}

float safeMod2(in float sum) {
	return step(mod(sum, 1.75),0.5);
}

float getPattern(in vec2 p, in float grid) {
	float val = everyOtherRow(p, grid);
	for(int i = 0; i <3; ++i) {
		p = ROTATION*p;
		val += everyOtherRow(p*0.5, grid);
		val*=float(i)*0.9;
	}
	return safeMod2(val);
}

vec3 colorMix(in vec3 a, in vec3 b, in float f) {
	return sqrt(mix(a*a,b*b,f));
}

vec3 getColor(in float t) {
	return vec3(normSin(t),normSin(t+TAU/3.0),normSin(t+2.0*TAU/3.0));
}

float getShading(in vec2 ouv, in vec2 uv, in float grid) {
	return (ouv.y*0.85+0.15)*(0.7+0.3*mod(uv.x,grid)/grid);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 ouv = uv;
	float ar = resolution.x/resolution.y;
	
	uv -= vec2(0.5,2.0);
	uv *= 0.35;
	uv.x *= ar;
	uv = cMult(uv, cExp(I*PI/4.0));
	uv = 4.0*cSin(4.0*cMult(uv,uv));
	
	float grid = 1.25;
	uv.y += -0.75*time;
	
	float pattern = getPattern(uv, grid);
	gl_FragColor = vec4(vec3(pattern)*getColor(time*0.1)*getShading(ouv, uv, grid), 1.0 );
}