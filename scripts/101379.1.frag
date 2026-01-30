#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float mono( vec3 icol ) {
	// Return mono counterpart of colour
	return (icol.x+icol.y+icol.z)/3.;
}

float rand(vec2 p, float seed) {
	return fract( sin( dot(p.xy, vec2(time+1.1727943, 2.9287374) ) ) * 103939.2989 );
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + surfacePosition;
	position -= .5;
	position *= 10.;
	position += rand(position, time)/10.;
	

	float color = 0.0;
	color += (
		tan( pow( ( pow(position.y,2.)+pow(position.x,2.) ), .5 ) - time ) 
		- position.y/position.x 
	);
	
	vec3 a = vec3(sin(position.x+position.y),cos(position.x+position.y),-sin(position.x+position.y));
	vec3 b = vec3( ( position.x*position.y ) );
	
	
	gl_FragColor += vec4( vec3(color) , .5 );
	gl_FragColor += vec4( vec3(cos(color)*a+b) , .5 );
	//gl_FragColor += vec4( vec3( (sin(color) * ( sin(position.x)-cos(position.y) ) ) ), .5);

}