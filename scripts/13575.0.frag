#ifdef GL_ES
precision mediump float;
#endif

#define MAXDISTANCE 40.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 scrP    = -1.0 + 2.0*gl_FragCoord.xy/resolution.xy;
	     scrP.x *= resolution.x/resolution.y;	
	
	vec3 camP      = vec3(-2.0, 0.0, 0.0 );
	vec3 trgP      = vec3( 0.0, 0.0, 0.0 );
	vec3 upV       = vec3( 0.0, 1.0, 0.0 );
	vec3 camV      = normalize( trgP - camP );
	vec3 camRightV = cross( upV, camV );
	vec3 camUpV    = cross( camV, camRightV );
	
	vec3 lightP = vec3(-5.0, 5.0, 2.0 );
	vec3 lightV = normalize(lightP);
	vec3 lightC = vec3( 1.0, 0.9, 0.5 );
	
	vec3 rayV = normalize( camV + camRightV*scrP.x + camUpV*scrP.y );
	
	gl_FragColor = vec4( abs(vec3(rayV)), 1.0 );

}