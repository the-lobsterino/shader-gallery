#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
const float PI = 3.141593;
	
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pixelSizeX = 0.01;
const float pixelSizeY = 0.1;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pc = position;
	pc.x = pixelSizeX * floor(pc.x/pixelSizeX + 0.5);
	pc.y = pixelSizeY * floor(pc.y/pixelSizeY + 0.5);
	
	vec3 col = hsv2rgb( vec3( time/2.0 + pc.y/12.0 - cos(time) * pc.x * sign(pc.x - 0.5), 1.0, 1.0 ) );
	float k = (1.0 + sin(time)/2.0);
	float s = (1.0 - cos(2.0 * PI * k * (pc.x - 0.5)))/2.0;
	
	col *= s;
	
	gl_FragColor = vec4( col, 1.0);

}