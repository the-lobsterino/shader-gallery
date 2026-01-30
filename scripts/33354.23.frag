// inspired by https://www.shadertoy.com/view/Mdd3D7

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize; 
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

const float PI = 3.141592;

float sinc(float x) {
	return sin( x * PI ) / x;
}

void main( void ) {
	
	float ti = time*1.1;
	vec2 cst = vec2( cos(ti), sin(ti) );
	
	vec2 uv = (surfacePosition)+(vec2(cos(ti),sin(ti))*0.125);
	
	float duv = dot(uv,uv);
	uv = mix( uv/duv, uv*duv, sin( length(uv) / (PI*2.0) ) );
	
	float N0 = 11.0;
	float N1 = 12.0;
	
	float r = length(uv);
	float theta = atan(uv.y,uv.x);
	
	float t = ti;
	float lr = log(r);
	
	float t0 = lr - theta + 0.25 * t;
	t0 = t0 / 2.0 / 3.14 + 0.5;
	t0 = fract( N0 * t0 );
	
	float t1 = lr + theta + 1.00 * t;
	t1 = t1 / 2.0 / 3.14 + 0.5;
	t1 = fract( N1 * t1 );
	
	float v = pow(t0*t1,fract(ti*1e-2));
	
	gl_FragColor = vec4( vec3( v ), 1.0 );

}