#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float currY = (0.5*(sin(p.x*10.0 + time)) * 0.5 + 0.5)  * resolution.y;
	gl_FragColor = vec4(vec3(1.0) *(1.0 - smoothstep(abs(currY-gl_FragCoord.y), 0.0,3.0)) , 1.0);
}