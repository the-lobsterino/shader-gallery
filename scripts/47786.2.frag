#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float length2(vec2 v) {
	return v.x*v.x + v.y*v.y;
}

void main() {

	vec2 p = 4.0*((gl_FragCoord.xy/resolution.xy * vec2(resolution.x/resolution.y, 1.0))-vec2(0.8, 0.5));
	
	vec2 v1 = vec2(sin(time*-0.261)+0.142, sin(time*0.841));
	vec2 v2 = vec2(sin(time*0.774)-0.421, cos(time*0.274));
	vec2 v3 = vec2(cos(time*0.395)+0.312, cos(time*-0.692));
	vec2 v4 = vec2(cos(time*-0.851)-0.263, sin(time*0.226));
	
	float d1 = length2(v1-p)*0.1;
	float d2 = length2(v2-p)*0.2;
	float d3 = length2(v3-p)*0.3;
	float d4 = length2(v4-p)*0.4;
	
	float mn = min(min(d1, d2), min(d3, d4));
	
	float c = 0.0;
	
	c += step(-1e-5, mn-d2)*0.333;
	c += step(-1e-5, mn-d3)*0.666;
	c += step(-1e-5, mn-d4);
	
	gl_FragColor = vec4(vec3(c), 1.0);

}