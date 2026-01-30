// 180720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 po = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	po /= dot(po,po);// + 0.25;
	float t = (surfaceSize.x+surfaceSize.y)*123.456789;
	float f = fract(t);
	float c1 = cos(t+f/po.x+4.*sin(t+f*po.y+3.));
	float c2 = cos(t+f*po.x+5.*sin(t+f/po.y+2.));
	float c3 = cos(t+f/po.x+6.*sin(t+f*po.y+1.));
	vec3 rb = vec3(c1,c2,c3);
	
	gl_FragColor = vec4( rb, 1.0 );

}