#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {

	vec2 fragCoordFactor = gl_FragCoord.xy / resolution.xy;

	//float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;

	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	
	float pi = 3.14159265359;
	
	float factor = ( sin(fragCoordFactor.x+time) + cos(fragCoordFactor.y+time+pi) + 2.0) * 0.25;
	
	
	vec4 col1 = vec4( (sin(time)+1.0)/2.0, (sin(time+pi)+1.0)/2.0, (sin(time+pi/2.0)+1.0)/2.0, 1.0 );
	vec4 col2 = vec4( (sin(time+pi)+1.0)/2.0, (sin(time+pi/2.0)+1.0)/2.0, (sin(time)+1.0)/2.0, 1.0 );
	
	vec4 finalColor = (col1 * (1.0 - factor)) + (col2 * factor);
	
	vec2 diff = fragCoordFactor-mouse;
	
	float distSquared = diff.x*diff.x*23.0+diff.y*diff.y*45.0;
	
	gl_FragColor = finalColor * max (0.0, (1.0-distSquared)*(0.5-distSquared)) / 0.07;
}