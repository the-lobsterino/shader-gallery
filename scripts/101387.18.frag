#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = surfacePosition*19.4;

	vec3 color = vec3(
		floor(sin(length(position))*1.001),
		floor(sin(length(position)+3.14159265*2./3.)*1.001),
		floor(sin(length(position)+3.14159265*2./3.*2.)*1.001)
	);
	color = clamp(color,0.,1.);
	color.rgb += 1.*float(abs(surfacePosition.x) < .003 || abs(surfacePosition.y) < .003);
	color.rgb += 1.*float(abs(surfacePosition.y) > 3.14159265/10.5-.005 && abs(surfacePosition.y) < 3.14159265/10.5);
	color.rgb += 1.*float(abs(surfacePosition.x) > 3.14159265/10.5-.005 && abs(surfacePosition.x) < 3.14159265/10.5);
	
	color.rgb += 1.*float(
		length(gl_FragCoord.xy-mouse*resolution) <= 200.
	)- 1.*float(
		length(gl_FragCoord.xy-mouse*resolution) <= 199.
	);

	gl_FragColor = vec4( vec3(color), 1.0 );

}