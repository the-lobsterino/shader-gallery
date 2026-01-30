#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 base03 = vec3( 0, 43, 54 ) / 255.0;
const vec3 base02 = vec3( 7, 54, 66 ) / 255.0;
const vec3 base01 = vec3( 88, 110, 117 ) / 255.0;
const vec3 base00 = vec3( 101, 123, 131 ) / 255.0;
const vec3 base0 = vec3( 131, 148, 150 ) / 255.0;
const vec3 base1 = vec3( 147, 161, 161 ) / 255.0;
const vec3 base2 = vec3( 238, 232, 213 ) / 255.0;
const vec3 base3 = vec3( 253, 246, 227 ) / 255.0;
const vec3 yellow = vec3( 181, 137, 0 ) / 255.0;
const vec3 orange = vec3( 203, 75, 22 ) / 255.0;
const vec3 red = vec3( 220, 50, 47 ) / 255.0;
const vec3 magenta = vec3( 211, 54, 130 ) / 255.0;
const vec3 violet = vec3( 108, 113, 196 ) / 255.0;
const vec3 blue = vec3( 38, 139, 210 ) / 255.0;
const vec3 cyan = vec3( 42, 161, 152 ) / 255.0;
const vec3 green = vec3( 133, 153, 0 ) / 255.0;

const float radius = 64.0;


vec3 lerp( vec3 a, vec3 b, float alpha ) {
	return vec3(
		a.x + ( b.x - a.x ) * alpha,
		a.y + ( b.y - a.y ) * alpha,
		a.z + ( b.z - a.z ) * alpha
	);
}



float dist( vec2 p1, vec2 p2 ) {
	float a = p2.x - p1.x;
	float b = p2.y - p1.y;
	
	return sqrt( a*a + b*b );
}



float dither( float value ) {
	vec2 f = gl_FragCoord.xy;
	
	
	
	return mod( gl_FragCoord.x + gl_FragCoord.y, 2.0 ) == 0.0 ? 0.0 : 1.0;
}



void main( void ) {
	float dst = clamp( 1.0 - distance( gl_FragCoord.xy, mouse * resolution ) / radius, 0.0, 1.0 );

	vec3 color = lerp( base03, base3, dither( dst ) * dst );
	
	gl_FragColor = vec4( color, 1.0 );

}