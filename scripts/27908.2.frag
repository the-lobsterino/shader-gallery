#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 hsv(in float h, in float s, in float v){
	vec3 f = vec3(.1,.2,.3 ) * time;
    return mix(vec3(1.),((abs(fract(h+vec3(3.,2.,1.)/3.+f)*6.-3.)-1.)),s)*v;
}

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy;
	uv.x /= resolution.x;
	uv.y /= resolution.x / 6.0;
	uv.y -= 1.;
	
	float at 	= atan(uv.x, uv.y);
	float l		= length(uv);
	
	gl_FragColor = vec4( (0.001,hsv(uv.x,1.,1.) - 1. + 2.*uv.y + sin(uv.x*10.+time*.1) ),1.);
}