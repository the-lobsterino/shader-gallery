#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//beatiful sun :)
//MrOMGWTF

#define BLADES 6.0
#define BIAS 0.1
#define SHARPNESS 3.0
#define COLOR 0.82, 0.65, 0.4
#define BG 0.34, 0.52, 0.76

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.65)) * vec2(resolution.y/resolution.x,1.0);
	vec3 color = vec3(0.);
	float ct,st;
	//ct = cos(time);
	//st = sin(time);
	//ct *= 0.2;
	//st *= 0.2;
	float blade = clamp(pow(sin(atan(position.y + ct,position.x -st /st*st/ st)*BLADES)-BIAS, SHARPNESS), 0.20, 0.8);
	
}