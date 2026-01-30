#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float rand(vec2 v){
	return fract(sin(dot(v.xy,vec2(33,78.233))) * 43758.5453);
}


float map(vec3 p) {
	float t = smoothstep(0.3, 0.870, cos(p.x) * cos(p.z)  );
	return 7.0 - dot(abs(p), vec3(0, 1, 0)) - t * 2.5;
}
		
		

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	uv*=normalize(resolution).xy;
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(time, 0, time);
	float t = 0.05;
	float temp = 0.0;
	for(int i = 0; i < 4192; i++)
	{
		temp = map(dir * t + pos) * 0.5;
		if(abs(temp) < 0.001) {
			t -= temp;
			break;
		}
		t += temp * .1;
	}
	vec3 ip = dir * t + pos;
	
	vec3 col = (vec3(t * 0.01) + map(ip * 1.0002));
	gl_FragColor = vec4(dir * 0.1 + col - vec3(temp), 1.0);
		
}