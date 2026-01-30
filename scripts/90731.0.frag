// since there's all that black and white stuff - i "repost" this!
// someone did it i dont't know who. just stumbled stumpled whatever on it...
// original source: https://glslsandbox.com/e#80918.0


// as one can see though it's not truly 100% black and white.

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 tex(vec2 uv, vec3 col1, vec3 col2)
{
	return (mod(floor(uv.x) + floor(uv.y), 2.0)==0.0?col1:col2);	
}

void main( void ) {

	vec2 position = surfacePosition;//( gl_FragCoord.xy / resolution.xy / mouse.x - mouse.y ) - vec2(0.5, 0.5); position.x *= resolution.x/resolution.y;
	vec2 uv = position*5.0;
	uv.x += sin(length(uv+time))*(sin(time*2.0)+1.0)*0.5;
	uv.y += cos(length(uv+time))*0.4;
	
	uv /= (1.01+cos(time+.2*dot(uv,uv)));
	
	gl_FragColor = vec4((tex(uv, vec3(uv.x*uv.y), vec3(1.0-uv.x*uv.y))), 1.0 );

}