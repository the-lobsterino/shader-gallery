#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb( float h, float s, float v ) {
	return ((clamp(abs(fract(h+vec3(0,2,1)/3.0)*6.0-3.0)-1.0,0.0,1.0)-1.0)*s+1.0)*v;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float hue = position.y * 10000. + time;
	
	if ( position.x >= 0.4 && position.x < 0.6 && position.y >= 0.4 && position.y < 0.6) {
		hue = 0.;
	}
	
	vec3 color = hsv2rgb( hue, 0.3, 1.0 );	

	gl_FragColor = vec4( color, 1.0 );

}
