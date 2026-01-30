//Well, the circles are bent. help pls
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
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
	#define time mod(time,2.)
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
    	vec2 uv = (gl_FragCoord.xy/resolution.xy)-.5;
    	uv.x /= resolution.y/resolution.x;
	float circles = 40.;
	float in_scale = .85;
	float zoom = (log(distshape(uv*pow(in_scale,time),circles))/log(in_scale));
	vec2 uv2 = vec2(fract(zoom),fract(((atan(uv.x,uv.y)+PI)/(PI*2.))*circles));
	if (mod(zoom,2.)>1.) {
		uv = rotate(PI/8.,uv);
		zoom = fract(log(distshape(uv*pow(in_scale,time),circles))/log(in_scale));
		uv2 = vec2(fract(zoom),fract(((atan(uv.x,uv.y)+PI)/(PI*2.))*circles));
	}
	gl_FragColor = vec4(vec3(1.-(((length(uv2-.5))-.35)*length(uv)*350.)),1.);
}