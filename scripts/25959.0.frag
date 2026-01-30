#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = vec2(0.5 + sin(time*0.1),0.5+ sin(time*0.1));
	vec2 p2 = vec2(0.3+ cos(time*0.2),0.7+ sin(time*0.15));
	vec2 p3 = vec2(1.0+ sin(time*0.06),1.0+ sin(time*0.07));
	gl_FragColor = vec4(sin(distance(uv, p3) * 100.0 - 3.0*time) + 
                     cos(distance(uv, p2) * 100.0 - 2.0*time) + 
                     sin(distance(uv, p) * 100.0 - 1.0*time), 
                     
                     sin(distance(uv, p3) * 100.0 - 3.0*time) + 
                     sin(distance(uv, p2) * 100.0 - 2.0*time) + 
                     cos(distance(uv, p) * 100.0 - 1.0*time), 
                     
                     sin(distance(uv, p3) * 100.0 - 3.0*time) + 
                     sin(distance(uv, p2) * 100.0 - 2.0*time) + 
                     sin(distance(uv, p) * 100.0 - 1.0*time)
                     ,1.0);
}
