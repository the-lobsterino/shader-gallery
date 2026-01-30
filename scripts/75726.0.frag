//Simple hexgrid - 94bytes version -> https://www.dwitter.net/d/24031

#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float rx = 50.+sin(time)*9.;
	float ry = rx/3.25;
	float color = cos(uv.x*rx-time*9.) / sin(uv.y*ry)>1.?.8:-1.;
	gl_FragColor = vec4( vec3( color), 1.0 );
}