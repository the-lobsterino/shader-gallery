precision mediump float;
uniform vec2  mouse;       
uniform float time;       
uniform vec2  resolution;   
uniform sampler2D smp;

const float PI = 3.1415926;
const float oct = 8.0;
const float per = 0.5;

//補間関数
float interpolate(float a, float b, float x){
	
	float f = (1.0 - cos(x * PI)) * 0.5;
	return a * (1.0 - f) + b * f;
}

//乱数生成
float rnd(vec2 p){
	
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43785.5453);
}

//補間関数
float irnd(vec2 p){
	
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(rnd(vec2(i.x, i.y)),
				  rnd(vec2(i.x + 1.0, i.y)),
				  rnd(vec2(i.x, i.y + 1.0)),
				  rnd(vec2(i.x + 1.0, i.y + 1.0)));
				  
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

//ノイズ生成
float noise(vec2 p){
	
	float n = 0.0;
	for(float i = 0.0; i < oct; i++){
		
		float freq = pow(2.0, i);
		float amp = pow(per, oct - i);
		n += irnd(vec2(p.x / freq, p.y / freq)) * amp;
	}
	
	return n;
}

void main(void){
	
	//noise
	vec2 w = gl_FragCoord.xy + vec2(time * 10.0);
	float n = noise(w);
	
	vec2 p = vec2(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0, 1.0, 1.0);
	
	float u = sin((atan(p.y, p.x) + time) * 10.0) * 0.01;
	u += n * 0.1;

	float s1 = 0.1 / abs(0.7 + u - length(p));
	float s2 = 0.1 / abs(0.4 + u - length(p));
	float s3 = 0.1 / abs(0.1 + u - length(p));

	gl_FragColor = vec4(vec3(s1) * vec3(s2) * vec3(s3) * color, 1.0);
}