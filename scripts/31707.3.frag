#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
varying vec2 surfacePosition;
uniform float time;
#define time (time+10.+10./(1.+length(surfacePosition)))
#define G vec2(8.)
#define gl_FragCoord (gl_FragCoord.xy-mod(gl_FragCoord.xy, G))

uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265358979323
vec2 rotate(float angle,vec2 position)
{
    mat2 matrix = mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
    return position*matrix;
}
float distshape(vec2 uv, float sides) { 
    float pi = radians(180.);
    float angle = atan(uv.x,uv.y)+(mod(sides,2.)==0.?(pi/sides):0.);
    float r = (pi*2.)/sides;
    return cos(floor(.5+angle/r)*r-angle)*length(uv);
}
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
    	vec2 uv = (gl_FragCoord.xy/resolution.xy)-.5;
    	uv.x /= resolution.y/resolution.x;
	
	vec2 sp = vec2(length(uv), atan(uv.x, uv.y));
	sp.r = pow(sp.r, 2.5);
	uv = sp.r*vec2(sin(sp.y), cos(sp.y));
	
	float circles = 40.;
	float in_scale = .85;
	float zoom = (log(distshape(uv*pow(in_scale,time),circles))/log(in_scale));
	vec2 uv2 = vec2(fract(zoom),fract(((atan(uv.x,uv.y)+PI)/(PI*2.))*circles));
	if (mod(zoom,2.)>1.) {
		uv = rotate(PI/8.,uv);
		zoom = fract(log(distshape(uv*pow(in_scale,time),circles))/log(in_scale));
		uv2 = vec2(fract(zoom),fract(((atan(uv.x,uv.y)+PI)/(PI*2.))*circles));
	}
	gl_FragColor = vec4(vec3(1.-(((length(uv2-.5))-.005)*length(uv)*50.)),1.);
}