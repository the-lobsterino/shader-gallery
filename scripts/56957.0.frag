#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 p = position;
	p.x += 0.2;
	p.x += sin(time * 0.5) * 10.;
	p.y += p.x;
	p += 1.0 / (length(position) * 2.) * 2.0;
	
	mat2 rot = mat2(cos(time), sin(time), -sin(time), cos(time));
	
	
	//p *= rot;
	float f = length(p * vec2(0.5, 0.5)); //* length(p + vec2(0.5, 0.5)) * (1.0) / 2.;
	
	gl_FragColor = vec4( 0., 0.1, 0.7, 1.0 ) * f;

}