#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float f( vec2 sp, vec2 ss, float t, vec2 m )
{
//	vec2 m = mouse * 2.0 - 1.0;
	return cos( dot(sp,sp) * sin( dot(m - ss,ss-sp) ) + t);
}

void main( void ) {
	
	vec2 m2 = cos(mouse * 2.0 - 1.0);
	float a = m2.y/m2.x;
	float ca = cos(a);
	float sa = sin(a);
	vec2 g = gl_FragCoord.xy * mat2( ca, -sa, sa, ca );

	float z = (g.y*resolution.x+g.x)/(resolution.x*resolution.y);
	float f0 = fract(f(z+g/surfacePosition,surfaceSize*mouse,z,m2));
	vec2 r = vec2( log( 1.0 - abs(vec2( f0, 1.0 - f0 )) ) );
	vec2 q = log( resolution );/// abs(mouse * 2.0 - 1.0) );
	vec2 m = floor(surfaceSize*q);//mouse * 2.0 - 1.0;
	vec2 st = floor(abs(surfacePosition*q));//gl_FragCoord.xy/resolution;
	float t = dot(st*sin(m.x/m.y),st*cos(m.y/m.x));
	float t2 = cos(r.x*abs(sin(r.y*t*sin(t))));
	gl_FragColor = abs(vec4(t2-sin(t)*st.x,t2+sin(t+0.5)/st.y,t2*t2,2.0));
	gl_FragColor.xyz *= 1.0 - vec3( fract(dot(gl_FragColor,gl_FragColor) + z) );
	gl_FragColor.xyz = vec3(dot( gl_FragColor.xyz, gl_FragColor.xyz ));



}
