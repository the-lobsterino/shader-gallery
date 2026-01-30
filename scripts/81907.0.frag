#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 4.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	float x = (gl_FragCoord.x - mouse.x)/resolution.x -mouse.x;
	float y = (gl_FragCoord.y - mouse.y)/resolution.x - mouse.y * resolution.y/resolution.x;
	float distance = sqrt(x*x + y *y);
	
	float value = 4.0 * 3.14 * distance - 2.0 * time;
	float value2 = 4.0 * 3.14 * distance + 3.14 * time;
	float angle = atan(y,x);
	float h =  0.5 + 0.5 * cos(value);
	float line = fract(10.0 * time + 100.0 * (0.5 + angle/6.28));
	float cuttoff = 1.0;
	float s =  line > cuttoff ? 1.0 : 1.0 - sin(3.14 * line/cuttoff);//0.5 + .5 * sin(2.0 * time);
	float v =  (distance  < 0.1 ? distance / 0.1 : 1.0 ) * (0.5 + 0.5 * cos(value2));//0.5 + .5 * sin(3.0 * time);

	gl_FragColor = vec4(hsv2rgb(vec3(h, s, v)), 1.0 );

}