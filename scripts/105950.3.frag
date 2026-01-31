#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float PI = 3.141579;

vec3 colorA = vec3(0.98, 0.2, 0.15);
vec3 colorB = vec3(0.15, 0.23, 0.89);
vec3 colorC = vec3(0.8, 0.9, 0.83);


float expImpulse( float x, float k )
{
    float h = k*x;
    return h*exp(1.0-h);
}


void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(0.0);

	color = mix(colorA, colorB, 0.05+sin(pos.y*PI/2.)/2.*abs(sin(time/3.)*2.));
	
	color = mix(colorC, color, expImpulse(pos.x, 2.));

	gl_FragColor = vec4(color, 1.0);

}