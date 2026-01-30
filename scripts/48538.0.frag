// shadertoy version: https://www.shadertoy.com/view/MlyczD

precision highp float;
uniform float time;
uniform vec2 resolution;
#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)
void main() {
	vec2 uv = (resolution.xy - gl_FragCoord.xy * 2.0 )/min(resolution.x, resolution.y);
	if(acos(abs(uv.y)) < 0.8667) discard;
	vec3 ro = vec3(0);
	vec3 rd = normalize( vec3(uv, 1));
	R(rd.xy, time * 0.2);
	float tm = time * 0.8; 
	float scale = 1.7;
	vec3 color = vec3(0.0);
	float t = 0.,d = 0.;
	for (float i= 0.;(i<1.0);i += 0.013) 
    	{
		if(d > 3.0) break;
		vec3 p = ro;
		d = abs( cos(p.y* 0.5) * cos(p.x* 0.5) );
		d = min(2.001 * d, 0.01 / abs(sin(p.y * 0.4) * cos((tm - p.x * 0.5))));
		d = min(d, t - (sqrt( p.x * p.x + p.y * p.y) * scale) );
		t += d + 0.001;
		ro+= rd * d;
	};
    (t>3.0)?(color =  rd * 0.7 + vec3(t * 0.84) * (d - 0.0199 ) + t * 0.0012):(color = rd * 0.52 +vec3(1.0));
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}// nabr