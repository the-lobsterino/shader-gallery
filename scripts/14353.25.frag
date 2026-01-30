#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float sdSphere( vec3 p, float s ) {
  return length(p)-s;
}
float sdPlane( vec3 p ) {
    return p.y;
}
float sdCube( vec3 p, float a ) {
  return length(max(abs(p) - vec3(a),0.0));
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float map(vec3 pos)
{
	return sdSphere(pos, 1.);
}
// approximate normal :: http://code4k.blogspot.com/2009/10/potatro-and-raymarching-story-of.html
vec3 getNormal( vec3 pos )
{
    vec3 eps = vec3( 0.001, 0.0, 0.0 );
    vec3 nor = vec3(
        map(pos+eps.xyy) - map(pos-eps.xyy),
        map(pos+eps.yxy) - map(pos-eps.yxy),
        map(pos+eps.yyx) - map(pos-eps.yyx) );
    return normalize(nor);
}
vec3 lightPos()
{
	return vec3( 5.0, 5.0, 3.0 );
}

void main( void ) {
	// camera   
	vec3 ro = vec3( 7.*cos(0.2*time),
        	        1.3,
                	7.*sin(0.2*time) );     // camera position aka ray origin

	vec3 ta = vec3( 0.0, 1.2, 0.0 );        // camera look-at position
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 pos = vec3(position, 3.0);
//	float color = sdSphere(vec3(0.5, 0.5, 3.999) - pos, 1.) >= 0. ? 1.0 : 0.0;
	vec3 color = getNormal(vec3(0.5, 0.5, 3.999) - pos);
	gl_FragColor = vec4( color, 1.0 );
}