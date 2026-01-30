#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (gl_FragCoord.xy / 0.5 - resolution) / resolution.y;
	vec2 mo = mouse / 0.5 - 1.0; mo.x /= resolution.y / resolution.x;
	
	vec4 col = vec4(1.0);
	
	col.rgb = vec3(length(uv - mo));
	
	gl_FragColor = vec4(col);

}