precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
 
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}
 
const int    oct = 8;
const float  per = 0.5;
const float  PI  = 3.1415926535;
const float cCorners = 1.0 / 16.0;
const float sSides   = 1.0/ 8.0;
const float cCenter = 2.0 / 4.0;
 
// 補完か関数
float interpolate(float a, float b, float x){
	float f = (1.0 - cos(x * PI)) * 0.5;
	return a * (1.0 - f) + b * f;
}
 
// 乱数生成
float rnd(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
 
float irnd(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
				  rnd(vec2(i.x + 1.0, i.y      )),
				  rnd(vec2(i.x      , i.y + 1.0)),
				  rnd(vec2(i.x + 1.0, i.y + 1.0)));
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}
 
// ノイズ生成
float noise(vec2 p){
	float uv = 0.0;
	for(int i = 0 ; i < oct ; i++){
		float freq = pow(2.0, float(i));
		float amp  = pow(per, float(oct - i));
		uv += irnd(vec2(p.x / freq, p.y / freq)) * amp;
	}
	
	return uv;
}
 
// シームレスノイズ
float snoise(vec2 p, vec2 q, vec2 r){
	return noise(vec2(p.x,       p.y      )) *       q.x  *      q.y    +
		   noise(vec2(p.x,       p.y + r.y)) *       q.x  * (1.0 - q.y) + 
		   noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) *     q.y    +
		   noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);
}
 
void main(void){
	//vec2 m = vec2(mouse.x * 2.0 - 1.0,  mouse.y * 2.0 - 1.0);
	vec2 p = gl_FragCoord.xy + vec2(time * 10.0);
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	float n = noise(p);
	
	float red = 0.5 / length(uv);
	float u = abs(sin((atan(uv.x, uv.y) - length(uv) + time) * 5.) * 0.25) + 0.6;
	float green = 0.05 / abs(u - length(uv));
	// seamless noise
	//const float map = 256.0;
	//p = mod(gl_FragCoord.xy + vec2(t * 10.0), map);
	//n = snoise(p, p / map, vec2(map));
	
    gl_FragColor = vec4(red, green + n + red * 0.1, 0. + n, 1.0);
    
}
