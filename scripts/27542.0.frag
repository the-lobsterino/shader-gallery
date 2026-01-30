#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tau = atan(1.0) * 8.0;

vec3 hue(float x)
{
	return clamp(2.0 * cos(vec3(tau * x) + (tau * vec3(0,2,1) / 3.0)),-1.0, 1.0) * 0.5 + 0.5;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + vec2(time*0.1, 1.0);

	vec3 color = vec3(0.0);
	
	color = pow(normalize(hue(uv.x)),vec3(sin(time)*0.5+0.5));
	
	gl_FragColor = vec4(color, 1.0);

}