#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 60
vec3 circle(vec2 pos,float size,vec3 color){
	return color * size / distance(pos,surfacePosition);
}

void main(void){
	float t = time * 0.08;
	float theta = 11.0;
	float r = 0.6;
	vec2 pos = vec2(0.0);
	vec3 color = vec3(0.0);
	for(int i=0; i<N; i++){
		float size = float(i) * 0.005;
		theta += PI / (float(N)*0.5);
		pos = vec2(cos(theta*t)*r,sin(theta-t)*r);
		vec3 c = vec3(0.0);
		c.r = 0.1 * cos(t*float(i));
		c.g = 0.1 * sin(t*float(i));
		c.b = 0.09 * sin(float(i));
		color += circle(pos,size,c);
	}
	gl_FragColor = vec4(color,1.0);
}