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

	vec2 uv = surfacePosition * 4.0 + 0.5;
	
	uv *= 1.-dot(uv,uv);
	
	uv = 0.5/abs(uv-0.5);
	
	float k = smoothstep(0.4,0.6, sin(time*.5));
	
	uv -= ((vec2(k+0.1*sin(time+cos(time))+0.2,0.25) * 2.0 )*surfaceSize);
	
	float duv = dot(uv,uv);
	
	uv *= 1.-duv;
	
	float v = smoothstep(0.5,abs(uv.x/resolution.x),duv*2.0);
	
	v *= v * v + v;
	
	v += sin(time) * duv + (atan( min(uv.x,uv.y), max(uv.y,uv.x) ));
	
	vec3 bg = vec3( uv.x, uv.x*uv.y, uv.y );
	
	gl_FragColor = vec4( mix( bg * bg, vec3(fract(1.5*v)), v*v ), 1.0 );

}
