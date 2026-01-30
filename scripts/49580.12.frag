#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float roundRect(vec2 p, vec2 size, float radius) {
  vec2 d = abs(p) - size;
	float v = sign(length(max(d+radius,0.0))- radius) + 2.0;
	return v;
}
float circle(vec2 p,vec2 o, float r){
return ceil(pow(o.x-p.x,2.0) + pow(o.y-p.y,2.0)	- r);
}
void main() {
	vec2 rJoyconPos = vec2(0,0);
	vec2 lJoyconPos = vec2(0,0);
	float t = mod(time, 2.);
	gl_FragColor = vec4(1.,0.,0.,1.);
    
	float y = 0.;
	
	if (t > 0.6){
		rJoyconPos.y = -0.04 * pow(0.5, (t - 0.6) * 50.);
		lJoyconPos.y = -0.04 * pow(0.5, (t - 0.6) * 50.);
	}else if (t > 0.4){
		lJoyconPos.y = -sin((t - 0.4) * 11.) * 0.05;
		rJoyconPos.y = -sin((t - 0.4) * 11.) * 0.05;
	}else if (t > 0.2){
			rJoyconPos.y = mix(0.4, 0., (t - 0.2) / 0.2);	
	}
	else {
			rJoyconPos.y = sin(time / 0.2 * 3.1415) * 0.02 + 0.4;	
	}
	
	
	vec3 color = vec3(1.0,0,0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	if(roundRect(p - vec2(-0.04,0) - lJoyconPos, vec2(0.41,0.41),0.2) == 1.0 && p.x < 0.0){ // L Joycon outline
     color = vec3(1.0);
	}
	if(roundRect(p - vec2(-0.034,0) - rJoyconPos, vec2(0.41,0.41),0.2) == 1.0 && p.x > 0.03){ // R Joycon outline
     color = vec3(1.0);
	}
	if(p.x > -0.05 && p.x < 0.03){ //middle bar
		color = vec3(1.0,0,0);
	}
	if(roundRect(p - vec2(-0.03,0) - lJoyconPos, vec2(0.35,0.35),0.15) == 1.0 && p.x < -0.12){ //L Joycon Inner
     color = vec3(1.0,0.0,0.0);
	}
	if(circle(p - lJoyconPos,vec2(-0.24,0.17),0.006) < 1.0){ //left circle
		color = vec3(1);
	}
	if(circle(p - rJoyconPos,vec2(0.2,-0.06),0.006) < 1.0){ //right circle
		color = vec3(1.0,0,0);
	}
	
    gl_FragColor = vec4(color, 1.0);
}