/*By Xor
Shader tutorial on converting GLSL Sandbox shaders to GameMaker: Studio: http://xorshaders.weebly.com/tutorials/converting-glslsandbox-shaders
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

vec2 uv = ( gl_FragCoord.xy / resolution.y );

vec3 color = vec3(fract(sin(dot(floor(uv.xy*32.0+time*2.0),vec2(5.364,6.357)))*357.536));
gl_FragColor = vec4( color, 1.0 );

}