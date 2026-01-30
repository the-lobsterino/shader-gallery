// pen16
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

const float PI = 3.14159;
const float N = 30.0;

float random(float n) {
	return fract(abs(sin(n * 55.753) * 367.34));
}

void main(){
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float d = length(st)*1.5;
	st.x += sin(time+sin(st.y*2.0))*0.42;
	
	st *= 5.0+sin(time)+cos(time*.6+d);
	
	float brightness = 0.0;
	vec3 baseColor = vec3(0.3, 0.15, 0.15);
	float speed = time * 1.4+ sin(st.x*0.6) - sin(st.y*0.4)*0.65;
	
	st.y += sin(time+st.x);
	
	for (float i = 0.0;  i < N;  i++) {
		brightness += 0.01 / abs(sin(PI * st.x) * sin(PI * st.y) * sin(PI * speed + random(floor(st.x )) + random(floor(st.y))));
		st.y *= 0.9;
		st.x *= 0.9;
	}
	
	gl_FragColor = vec4(baseColor * brightness*0.2, 1.0);	
}