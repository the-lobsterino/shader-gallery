#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

vec2 rgb3toxy2( in vec3 rgb ) {
    rgb *= vec3( 8.0, 0.125, 0.125);
    float f8 = fract( rgb.r );
    return rgb.yz + vec2( (rgb.r - f8) * 0.125, f8 );
}

void main( void ) {
	
	float o = (gl_FragCoord.y * resolution.x + gl_FragCoord.x);
	float t = o * 8.0;
	vec2 p = abs(mix(gl_FragCoord.xy,gl_FragCoord.xy+surfacePosition,1.0)*surfacePosition*2.0);
	float dp=dot(p,p);
	float cdp=cos(dp);
	float v = cos(t*cdp);
	vec3 c = v * vec3(p,1.0);
	c = vec3(rgb3toxy2(c), dot(c,c));
	float d = dot(c,c);
	gl_FragColor = vec4( vec3(d), 1.0 );

}