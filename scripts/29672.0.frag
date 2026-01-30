#ifdef GL_ES
precision mediump float;
#endif

varying vec4 color;
varying vec3 mynormal; 
varying vec4 myvertex; 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 ComputeLight (const in vec3 direction, const in vec4 lightcolor, const in vec3 normal, const in vec3 halfvec, const in vec4 mydiffuse, const in vec4 myspecular, const in float myshininess) {
	float nDotL = dot(normal, direction)  ;         
	vec4 lambert = mydiffuse * lightcolor * max (nDotL, 0.0) ;  

	float nDotH = dot(normal, halfvec) ; 
	vec4 phong = myspecular * lightcolor * pow (max(nDotH, 0.0), myshininess) ; 

	vec4 retval = lambert + phong ; 
	return retval ;            
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}