#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec3 v;

//yes I know... just needed a break

void main( void ) {
	vec2 position = (gl_FragCoord.xy/resolution.xy) - 0.5 ;
	float y = 0.2 * position.y * sin(300.0 * position.y - 20.0 * time *0.01);
	y = 1. / (600. * abs(position.x - y));
	
	y += 1./length(665.*length(position - vec2(0., position.y)));
	
	float saule = 1./length(65.*length(position - vec2(0, 0)));
	
	vec4 vsaule = vec4(saule, saule, saule*5., 1.0);
	vec4 vstari = vec4(position.y*0.5 - y, y, y*5., 1.0);

	gl_FragColor = mix(vsaule, vstari, abs(sin(time)));
	
}