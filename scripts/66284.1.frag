// 180720N
// 240720N I GET TIRED :)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

void main( void ) {

	vec2 po = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	
	//vec4 bb = texture2D(backbuffer, po);
	
	po /= dot(po,po)*(1.5 + sin(time));// + 0.25;
	
	po.x += sin(time)*po.y;
	po.y += cos(time)*po.x;
	
	float t = (surfaceSize.x+surfaceSize.y)*123.456789;
	float f = fract(t);
	float c1 = cos(t+f/po.x+4.*sin(t+f*po.y+3.));
	float c2 = cos(t+f*po.x+5.*sin(t+f/po.y+2.));
	float c3 = cos(t+f/po.x+6.*sin(t+f*po.y+1.));
	vec3 rb = vec3(c1,c2,c3);
	
	float ff = sin(time*1.);
	vec3 bc = ff*vec3(0.1618, 2.*0.1618, 3.* 0.1618);
	
	gl_FragColor = vec4( rb * bc , 1. ); // + bb;

}