#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 color = vec4(1, 1, 1, 1);

void render (float a){
	gl_FragColor = clamp(vec4(color.xyz * clamp(1. - a, 0., 1.), 1.),0.0,1.0);
}

#define PI acos(-1.)

void main( void ) {
	
	gl_FragColor = vec4(1.0);
	vec2 pos = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
	
	vec2 center = resolution / 2.;
	
	vec2 dir = center - pos;
	float angle = atan(dir.x, -dir.y) + PI;
	
	if (angle > mod(time * 2., PI * 4.) - PI * 2. && angle < mod(time * 2., PI * 4.))
	render(length(pos - center) - min(resolution.x, resolution.y) / 2. + 20.);
}