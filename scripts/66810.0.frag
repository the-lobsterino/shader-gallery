#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define sat(v) clamp(v, 0.0, 1.0)

float circle(float len, float radius, float width, float smooth)
{
	float value1 = (len - (radius - width)) / smooth;
	float value2 = (len - (radius + width)) / smooth;
	float value = sat(value1 * value2);
	float v = sat(1.0 - abs(value));
	return v;
}

void main( void ) {
	
	vec2 p = surfacePosition;
	
	float width = 0.0;
	float radius = 0.5;
	float offset = 0.0;
	
	float c1 = circle(length(p), 0.4, 0., 0.001);
	float c2 = circle(length(p), 0.6, 0., 0.001);
	float c3 = circle(length(p), 0.5, 0., 0.1);
	vec3 color = vec3(0., c1+c2, c3);
	
	gl_FragColor = vec4(color, 1.0 );

}