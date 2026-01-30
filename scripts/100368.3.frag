#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * 2.0;
	float aspectratio = resolution.x / resolution.y;
    	position.x *= aspectratio;
	
	
    	gl_FragColor.rg = position;
    	gl_FragColor.b = 0.0;
	
	float thickness = 0.8;
    	float fade = 0.005;

	float distance = 1.0 - length(position);
    	vec3 col = vec3(smoothstep(0.0, fade, distance));
    	col *= vec3(1.0 - smoothstep(thickness, thickness + fade, distance));

	gl_FragColor.rgb = col;
	gl_FragColor.rgb *= vec3(0.2, 0.3, 0.9);
}