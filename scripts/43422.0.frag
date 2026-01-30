/*By Xor
Shader tutorial on converting GLSL Sandbox shaders to GameMaker: Studio: http://xorshaders.weebly.com/tutorials/converting-glslsandbox-shaders
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
#define time (time + sin(gl_FragCoord.x / resolution.x * 300.)*0.05 + cos(gl_FragCoord.y / resolution.y * 100.) * 0.1 + 0.3 * sin(40. * length(gl_FragCoord.xy / resolution - .5)))

void main( void ) {

vec2 uv = ( gl_FragCoord.xy / resolution.y );

vec3 color = vec3(fract(sin(dot(floor(uv.xy*32.0+time*2.0),vec2(5.364,6.357)))*357.536));
gl_FragColor = vec4( color, 1.0 );

} 