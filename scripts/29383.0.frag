#ifdef GL_ES
precision mediump float;
#endif

const vec3 max_rgb_color = vec3( 1.0, 1.0, 1.0 );

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const mat3 to_xyz = mat3( 0.4124, 0.3575, 0.1805,
			  0.2126, 0.7152, 0.0722,
			  0.0193, 0.1192, 0.9505 );
const mat3 from_xyz = mat3(  3.2406, -1.5372, -0.4986,
			    -0.9689,  1.8758,  0.0415,
			     0.0557, -0.2040,  1.0570 );

// Converts sRGB components to RGB
float srgb_to_linear( float c_srgb ) {
	return c_srgb <= 0.04045 ?
		c_srgb / 12.92 :
		pow( ( c_srgb + 0.055 ) /
		     ( 1.0 + 0.055 ), 2.4 );
}

// Converts sRGB to CIEXYZ
vec3 srgb_to_xyz( vec3 srgb ) {
	vec3 linear_color;
	
	for (int i = 0; i < 3; i++) {
		linear_color[i] = srgb_to_linear( srgb[i] );
	}
	
	return linear_color * to_xyz;
}

// This prevents infinite slope when converting to CIELAB
float xyz_f( float t ) {
	return t > pow( 6.0 / 29.0, 3.0 ) ?
		pow( t, 1.0 / 3.0 ) :
		1.0 / 3.0 * pow( 29.0 / 6.0, 2.0 ) * t + 4.0 / 29.0;
}

vec3 xyz_to_srgb( vec3 xyz ) {
	vec3 rgb_linear = from_xyz * xyz;
	vec3 srgb;
	
	for (int i = 0; i < 3; i++) {
		srgb[i] = rgb_linear[i] <= 0.0031308 ?
			12.92 * rgb_linear[i] :
			1.055 * pow( rgb_linear[i], 1.0 / 2.4 ) - 0.055;
	}
	
	return srgb;
}

vec3 color_clamp( vec3 color ) {
	vec3 result;
	
	return (color.x > 1.0 || color.y > 1.0 || color.z > 1.0) ?
		vec3(0.0) : clamp( color, 0.0, 1.0 );
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float Y = sin( time / 4.0 )/2.0 + 0.5;
	vec3 src = vec3(position.x * 4.0 - 2.0,
			Y,
			position.y * 4.0 - 2.0);
	
	vec3 start_color = color_clamp( xyz_to_srgb( src ) );
	
	vec3 xyz = srgb_to_xyz( start_color );
	
	vec3 max_xyz = srgb_to_xyz( max_rgb_color );

	gl_FragColor = position.y > 0.5 + sin( time ) * 2.0 ?
		vec4( abs( xyz_to_srgb( xyz ) - start_color ), 1.0 ) :
		vec4( start_color, 1.0 );
}