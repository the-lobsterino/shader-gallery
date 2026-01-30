#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265358979323
#define FADE(a, b, mu) (((a) * (mu)) + ((b)*(1.0-(mu))))
float draw(vec2 uv) {
	float d=length(uv);
	float x = (d-.4)*60.;
	return clamp(x,0.,1.);
}
void main(void) {
	vec3 base_color_1 = vec3(114, 135, 158) / 255.;
	
	vec2 uv=(gl_FragCoord.xy/resolution.xy)-.5;
	uv.x*=resolution.x/resolution.y;
	vec3 c=vec3(0);
	for (int i=0;i<4;i++) {
		float theta=((float(i)/3.)*PI) * time * .5;
		vec2 u = (float(i+1)  * (0.75 + 0.25 * sin(time))) * uv*mat2(cos(theta),-sin(theta),sin(theta),cos(theta));
		u = sin(u*(abs(sin(time*0.))+.25)*10.);
		c[i] = draw(u-.5);
	}
	float gray = (c[0] + c[1] + c[2]) / 3.0;
	// gl_FragColor=vec4(c,1.);
	
	gl_FragColor = vec4(FADE(base_color_1, vec3(1., 1., 1.), gray), 1.);
}