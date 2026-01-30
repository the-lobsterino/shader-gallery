// biscuit
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy );
	vec2 positionTimed = position - time*0.1;
	vec2 positionNormalized = positionTimed*8.0;
	
	vec2 moded = mod(positionNormalized, 4.);

	float ar = -abs(position.y - 0.5) * (4.0+4.*sin(time)+4.0);	// remove ( ) 
	float n = mod(time+moded.x + ar, 2.)-1.0;
	float o = mod(time+moded.x - ar, 2.)-1.0;
	
	n = smoothstep(0.0,0.0,n);
	n = n + o;
	
	vec3 color = mix(vec3(n,o,o),vec3(0.0,0.0,0.0),n )*3.0;// n+o
	gl_FragColor = vec4( color, 1.0 );
}




