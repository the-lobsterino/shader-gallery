#ifdef GL_ES
precision highp float;
#endif
const float PI = 3.1415926535897932384626433832795;
const float PI_2 = 1.57079632679489661923;
uniform float time;
varying vec2 uv;
float radius = 100.0;
float amplitude = 10.0;
uniform vec2 resolution;
float parabola( float x, float k )
{
    return pow( 4.0*x*(1.0-x), k );
}
void main () {
	vec2 position = gl_FragCoord.xy - resolution / 2.0;
	float angle = atan(position.y, position.x);
	float localAmplitude = max(0.0,parabola(mod(time+angle/PI,2.0),1.0));
	float color = length(position) - radius
	    + sin(time / 2.0  + atan(position.y, position.x) * 8.0 - PI_2) * amplitude * localAmplitude;
	gl_FragColor = vec4(vec3(color), 1.0 );
}