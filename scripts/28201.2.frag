#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float w = resolution.x;
float h = resolution.y;

void main( void ) 
{
        float move = (w / 10.0) * (cos(time));
	vec2 pos2 = vec2(w * 0.5, h * 0.5);
	
	float dist2 = length(gl_FragCoord.xy - pos2) + 10.0*sin(time)-100.0;
	
	float size2 = 50.0;
	
	float color = 0.0;
	float color2 = 0.0;
	color2 += pow(size2 / dist2, 0.5);
	float color3 = mix(color, color2, 0.5);
	gl_FragColor = vec4(vec3(color3 / 2.0, color3 / 3.0, color3 / 1.5), 1.0);
}