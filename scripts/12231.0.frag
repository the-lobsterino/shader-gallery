#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float x;
float y;
float timer;

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy );
	float s = abs(sin(500.)*tan(time*5.)+gl_FragCoord.y);
	float m = ceil(time*p.x*sin(time)*gl_FragCoord.x);
	
	
	
	
	float r = (cos(s)/sin(m)/7.);
	float g = floor(sin(p.y*gl_FragCoord.x));
	float b = r/tan(m)/1.;
	
	gl_FragColor = vec4(r,g,b,1);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}