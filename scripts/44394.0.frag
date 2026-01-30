/*By Xor
Shader tutorial on converting GLSL Sandbox shaders to GameMaker: Studio: http://xorshaders.weebly.com/tutorials/converting-glslsandbox-shaders
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

vec2 uv = ( gl_FragCoord.xy / resolution.x );

vec3 color = vec3(fract(tan(dot(floor(uv.xy+10.0+time*1.0),vec2(52,6.357)))*7.536));
gl_FragColor = vec4( color, 1.0 );

}