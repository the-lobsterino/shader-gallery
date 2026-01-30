#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	    vec2 pos = vec2(position*5.0);
	vec2 f = fract(position);
    vec2 i = floor(position);

  	   float x = floor(mod(pos.x,2.0)) * pos.x;
vec3 color = vec3(x);
	gl_FragColor = vec4(color, 1.0);

}