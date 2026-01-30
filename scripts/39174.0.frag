#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec4 u_color;
float wave(float t, vec2 p, float a, float b, float c)
{
  return (p.y - p.x)+cos(t);//clamp(abs(0.009 / (p.y - c * sin(a * p.x + b * t))), 0.0, 1.0);
}

vec4 render(float t, vec2 p)
{
	vec3 color = vec3(0.0);
	float a = wave(t, p, 10.0, 2.0, 0.2);
	color += vec3(a, 0.1, 0.4);	
  	return vec4(color, 2.0);
}

void main( void ) {
    vec2 p = 4.0 * (gl_FragCoord.xy / resolution.xy - 0.6) * resolution.xy / resolution.y;    
    gl_FragColor = render(time, p);
    
}