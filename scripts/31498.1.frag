#ifdef GL_ES
precision mediump float;
#endif

// yj by @hintz 2012-02-18

uniform float time;
uniform vec2 resolution;

void main(void) 
{
	vec2 v = (gl_FragCoord.xy - resolution * 0.5) / min(resolution.y,resolution.x);
	vec3 col;
	
	float c = v.x*v.x+v.y*v.y - cos(2.0 * time);
	c*=c;
	c*=c;
	col = vec3(1.0-c,c,1.0-c);
		
	gl_FragColor = vec4(col, 3.0);
}