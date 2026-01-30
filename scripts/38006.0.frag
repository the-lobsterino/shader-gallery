
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D ack;

const float amount = -0.2;



void main( void )
{
vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
float t = atan(p.y, p.x) ;
t = sin(t * 10.0);
	gl_FragColor = vec4(vec3(t), 1.0) ;
}