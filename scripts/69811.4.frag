#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float f( vec2 sp, vec2 ss, float t )
{
	return cos( dot(sp,sp) * cos( dot(sp,ss) * 3.1415926 ) + t);
}

void main( void ) {

	float z = ((2.0*3.1415926))*((gl_FragCoord.y*resolution.x+gl_FragCoord.x)/(resolution.x*resolution.y));
	float f0 = cos(f(surfacePosition,surfaceSize,z));
	vec2 r = vec2( exp( - abs(vec2( f0, 1.0 - f0 )) ) );
	vec2 q = cos( surfacePosition/resolution );/// abs(mouse * 2.0 - 1.0) );
	vec2 m = floor(surfaceSize*q);//mouse * 2.0 - 1.0;
	vec2 st = floor(abs(surfacePosition*q));//gl_FragCoord.xy/resolution;
	float t = dot(st*sin(m.x/m.y),st*cos(m.y/m.x));
	float t2 = cos(r.x*abs(sin(r.y*t*sin(t))));
	gl_FragColor = abs(vec4(t2-sin(t)*st.x,t2+sin(t+0.5)/st.y,t2*t2,2.0));
	gl_FragColor.xyz = vec3( fract(dot(gl_FragColor,gl_FragColor) + z) );



}
