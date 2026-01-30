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

	vec2 p1 = ( gl_FragCoord.xy / res.xy );
	vec2 p = p1*2.-1.;
	p.x = p.x * res.x/res.y;
	float d = sqrt(p.x*p.x + p.y*p.y);
	float a = atan(p.x,p.y);
	if (a<0.){a=a+PI*2.;}
	
	vec3 col;
	
	// KALEIDO
	float of; // offset
	float segs = 8.;
	float sw = 1./segs;
	float seg = floor(a/PI/2.*segs);
	of = PI*2. * ( (1.-seg/segs)-sw/4.65-PI/4. );
	
	p1.x = sin(a+of)*d;
	
	float lx=.03;
	float lw=.02;
	col = vec3( p1.x )*.5;
	if (p1.x>lx && p1.x<lx+lw) { col = vec3(.9); }
	if (p1.x<.3) { col += .2; }
	if ( mod(p1.x+.2, .16)<.02) { col += vec3(.9,.9,.3)*.2; }
	
	gl_FragColor = vec4( col, 1.0 );

}