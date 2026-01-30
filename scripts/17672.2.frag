#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 res = resolution;

float rand(vec2 co) {return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}
float PI = 3.14159265358979323846;
vec3 rgb(float r, float g, float b) {return vec3(r/255.,g/255.,b/255.);}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / res.xy )*2.-1.;
	p.x = p.x * res.x/res.y;
	float d = sqrt(p.x*p.x + p.y*p.y);
	float a = atan(p.x,p.y);

	float lw = .02;
	float lx = .2*(sin(time)*.5+.5)+.1;
	vec3 col = vec3(.5);
	
	p.x -= p.x/abs(p.x)*abs(p.y);
	p.x += mod(p.x,.05);
	
	if (abs(p.x)>lx && abs(p.x)<lx+lw) {
		col = vec3( (1.-lx) );
	}
		
	gl_FragColor = vec4( col, 1.0 );

}