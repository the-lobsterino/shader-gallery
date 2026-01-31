#ifdef GL_ES
precision mediump float;

#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.14159

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	
	vec3 color = vec3(0., 0., .2);
	float borderInPixels = 15.;
	
	vec3 highlightColor = vec3(1., 0.7, 0.);
	float strength = 0.;
	if (gl_FragCoord.y <= borderInPixels && gl_FragCoord.y <= gl_FragCoord.x && gl_FragCoord.y <= resolution.x-gl_FragCoord.x) {
		
		strength = cos(fract(time + uv.x  * 3.) * pi);
		
	} else if (gl_FragCoord.x <= borderInPixels && gl_FragCoord.y >= gl_FragCoord.x && gl_FragCoord.y <= resolution.y-gl_FragCoord.x) {
		
		strength = cos(fract(time - uv.y*3.) * pi);
		
	} else if (gl_FragCoord.y >= resolution.y-borderInPixels && gl_FragCoord.y >= resolution.y-gl_FragCoord.x && resolution.y-gl_FragCoord.y <= resolution.x-gl_FragCoord.x) {
		
		strength = cos(fract(time - uv.x*3.) * pi);
		
	} else if (gl_FragCoord.x >= resolution.x-borderInPixels && resolution.y-gl_FragCoord.y >= resolution.x-gl_FragCoord.x && gl_FragCoord.y >= resolution.x-gl_FragCoord.x) {
		
		strength = cos(fract(time + uv.y*3.) * pi);
		
	}
	
	
	
	
	color.rgb = mix(color.rgb, highlightColor, strength);

	gl_FragColor = vec4(color, 1.0 );

}