// LOL
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	
	vec2 p = position - vec2(0.0, 1.0);
	p.x -= 0.5+sin(time*0.45)*0.5;
	float theta = atan(p.y / p.x) - (time / 4.0);
	float seg = theta / (3.1416/ 8.0);
	float color = clamp(floor(mod(seg, 2.0)), 0.2, 0.7);
	gl_FragColor = vec4(color*3.2, color, color , 1.0 );

}