#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 circle(vec2 p) {
	return vec2(length(p), 0.3);
}

vec2 square(vec2 p) {
	return vec2(abs(p.x) + abs(p.y), 0.5);
}

vec2 heart(vec2 st){
	st = (st - vec2(0.0, 0.0)) * vec2(2.1, 2.8);
	return vec2(pow(st.x, 2.0) + pow(st.y - sqrt(abs(st.x)), 2.0), 0.5);
}

vec2 morphing(vec2 p, float progress){
	int currentStage = int(floor(mod(progress, 3.0) ));
	float currentProgress = mod(progress, 1.0);
	
	if (currentStage == 0) return mix(circle(p), heart(p), currentProgress);
	if (currentStage == 1) return mix(heart(p), square(p), currentProgress);
	if (currentStage == 2) return mix(square(p), circle(p), currentProgress);
	return vec2(0);
}

vec4 render(vec2 p, float progress){
	vec2 d = morphing(p, time *2.0 );
	vec3 color = vec3(1.0 - step(d.x, d.y));
	return vec4(color, 1.0);
}
	

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) /min(resolution.x, resolution.y);
	float a = sin(time * 5.0) * 0.5 + 0.5;
	float mouseSwitch = mouse.x * 3.0; 
	
	
	vec4 color = vec4(0);

	
	vec4 antialiased = vec4(0);
	antialiased += render(p + vec2(0.0015, 0.0015), time* 2.0);
	antialiased += render(p + vec2(-0.0015, 0.0015), time* 2.0);
	antialiased += render(p + vec2(0.0015, -0.0015), time* 2.0);
	antialiased += render(p + vec2(-0.0015, -0.0015), time* 2.0);
	antialiased /= 4.0;
	gl_FragColor = antialiased;
	
}