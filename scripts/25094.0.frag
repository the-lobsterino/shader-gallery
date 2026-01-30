#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265358979323846264338
//Look guys I just made an egg with 3 different yolk






//Please don't read the terrible code. I haven't read a metaball shader code.
//By anastadunbar
//https://www.shadertoy.com/user/anastadunbar

vec2 rotate(vec2 pos, float angle) {
	float a = (PI/2.);
	return pos*mat2(sin(angle),cos(angle),sin(angle+a),cos(angle+a));
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv = ((( gl_FragCoord.xy / resolution.xy )-.5)*vec2(2.,1.))+.5;
	
	vec2 posanime = vec2(0.);
	
	posanime=(vec2(sin(time),cos(time*1.2))/4.)+0.5;
	float a1 = 1.- (length(uv-vec2(posanime))-0.2)*500.;
	posanime=(vec2(sin(time*0.5),cos(time*0.5))/4.)+0.5;
	float a2 = 1.- (length(uv-vec2(posanime))-0.2)*500.;
	posanime=(vec2(sin((time*0.3)+2.),cos(time/3.))/4.)+0.5;
	float a3 = 1.- (length(uv-vec2(posanime))-0.2)*500.;
	
	float b = sqrt(dot(uv.x-0.5,uv.y-0.5));
	float c = (atan(uv.x-0.5,uv.y-0.5)+PI)/(PI*2.);
	
	float a4 = 0.;
	//BONUS
	vec3 rgb_dance = clamp(vec3(a1,a2,a3),0.,1.);
	
	//Using loops for blur (Worst metaball technique)
	int loops = 20;
	#define loops  20
	for (int i = 0; i < (loops); i++) {
	float ii = float(i);
	float loops1 = float(loops);
	vec2 uv2 = uv+(vec2(sin(ii*(360./loops1)),cos(ii*(360./loops1)))/30.);
	posanime=(vec2(sin(time),cos(time*1.2))/4.)+0.5;
	a1 = 1.- (length(uv2-vec2(posanime))-0.2)*6.;
	posanime=(vec2(sin(time*0.5),cos(time*0.5))/4.)+0.5;
	a2 = 1.- (length(uv2-vec2(posanime))-0.2)*6.;
	posanime=(vec2(sin((time*0.3)+2.),cos(time/3.))/4.)+0.5;
	a3 = 1.- (length(uv2-vec2(posanime))-0.2)*6.;
	a1 = clamp(a1,0.,1.);
	a2 = clamp(a2,0.,1.);
	a3 = clamp(a3,0.,1.);
	
	a4 += ((a1+a2+a3)/3.)/loops1;
	
	}
	a4 -= 0.2;
	a4 *= 200.;
	
	vec3 colors = clamp(vec3(a4),0.,1.);

	gl_FragColor = vec4(colors-rgb_dance, 1.0 );

}