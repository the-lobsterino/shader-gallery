#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define BARS 20.
#define BASE_HUE 0.221

// HSV2RGB code from here:
// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	
	float aspect = resolution.y / resolution.x;

	vec2 position = ( gl_FragCoord.xy / resolution.xx - vec2(.5,aspect*.5));
	
	float a = atan(position.x, position.y);
	float r = length (position);
	
	a+=time/2.;
	
	position = vec2 (r*cos(a), r*sin(a));

	float i = step( (position.y*.5+.5)/(BARS*sin(time)), mod( position.x, 1./(BARS*sin(time))));

	float hue = BASE_HUE + i/12.;
	
	gl_FragColor = vec4( hsv2rgb(vec3(hue,.7,clamp((.9/r-.8),0.,1.)))*(1.-i*.2), 1.0 );

}