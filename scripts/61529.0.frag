#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

// http://marcodiiga.github.io/encoding-normalized-floats-to-rgba8-vectors
vec4 packFloatToVec4i(const float value) {
  const vec4 bitSh = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
  const vec4 bitMsk = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
  vec4 res = fract(value * bitSh);
  res -= res.xxyz * bitMsk;
  return res;
}

void main( void ) {
	
	float o = surfacePosition.y * surfaceSize.x + surfacePosition.x;
	float p = o / (surfaceSize.x * surfaceSize.y);
	
	gl_FragColor = vec4( packFloatToVec4i(p).xyz, 1.0 );

}