/*By Xor
Shader tutorial on converting GLSL Sandbox shaders to GameMaker: Studio: http://xorshaders.weebly.com/tutorials/converting-glslsandbox-shaders
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 m = mouse;
vec2 uv = surfacePosition;//( gl_FragCoord.xy / resolution.y );
	float d = m.y/m.x;//dot(uv,uv);
	//if ( d < 1.0 && d > 0.0) 
	uv=(abs(uv*atan(d)));

vec3 color = vec3(fract((dot(floor(uv.xy*32.0+d*8.0),vec2(5.364,6.357)))*357.536));
gl_FragColor = vec4( uv.xy * dot(color,color), 0., 1.0 );
}