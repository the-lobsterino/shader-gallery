#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

void main( void ) {
  gl_FragColor = vec4(sdSphere(vec3(gl_FragCoord.x,gl_FragCoord.y,gl_FragCoord.z), 1.0), 0, 0, 1);
	
}