#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float lengthN(vec2 v, float n)
{   
	vec2 tmp = pow(abs(v), vec2(n));   
	return pow(tmp.x+tmp.y, 1.0/n); 
}   
float rings(vec2 p)
{   
	return sin(lengthN(p, 4.0)*16.0);
}   
void main() {   
	vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
	gl_FragColor = vec4(rings(pos)); 
}