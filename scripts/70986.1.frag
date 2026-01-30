// move the mouse over the screen

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float pi = 3.14159265359;

vec2 position;
vec2 pixel;

float expandColor(vec2 offset) {
	float n = texture2D(backbuffer, position + pixel * offset).g;
	return n;
	if (n > 0.) return n;
	else return 0.0;
}

void main( void ) {
	
	position = ( gl_FragCoord.xy / resolution.xy );
	pixel = 1./resolution;
	
	vec3 col = vec3(0.);
	
	col = texture2D(backbuffer, position).xyz;
	
	vec2 p = vec2(0.4 * cos(3.0 * time), 0.4 * sin(2.0 * time));
	p += 0.5;
	if (length(position-p) <= 0.01) col.g = 1.0;
	
	float f = 0.0;
	f = max(expandColor(vec2(-1., -1.)), f);
	f = max(expandColor(vec2(1., 1.)), f);
	f = max(expandColor(vec2(1., 0.)), f);
	f = max(expandColor(vec2(0., 1.)), f);
	f = max(expandColor(vec2(0., -1.)), f);
	f = max(expandColor(vec2(-1., 0.)), f);
	f = max(expandColor(vec2(-1., 1.)), f);
	f = max(expandColor(vec2(1., -1.)), f);
	
	col.g = max(f, col.g);
	if (col.g > 0.) col.r = 1.0- col.g;
	col.b = col.r * col.g;
	col.r = 0.;
	
	col -= 1./170.;

	gl_FragColor = vec4( col, 1.0 );

}