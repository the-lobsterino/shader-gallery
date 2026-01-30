#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 resolution;

void main(void){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float z = 0.5+sin(time*1.5+p.x*2.5)*0.5;
	p*=1.0+z * 0.1;
	z=1.0-z;
	z = 0.7+(z*.85);
	p.x += time*0.2;
	vec3 col1 = vec3(0.7,0.3,0.3);
	vec3 col2 = vec3(0.4,0.0,0.4);
	float d = step(sin(p.y*20.0)+sin(p.x*20.0),0.0);
	gl_FragColor = vec4(mix(col1,col2,d)*z,1.0);
}