#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec3 n(vec2 x, float t) {
	vec3 v = floor(vec3(x,t));
	vec3 u = vec3(v.xy, v.z);
	vec3 c = fract(u.xyz * vec3(0.1,0.8,0.9) + u.yzx*vec3(0.3,0.6,0.1) + u.zxy*(0.7,0.2,0.3));
	return v + c;
}

void main( void ) {
	
	vec2 x = gl_FragCoord.xy / resolution.xy * 4.0;
	float t = time * 0.2;
	vec4 c = vec4(vec3(0.0), 0.1);
	
	for (int N=0; N<3; N++){
		for (int k=-1; k<=0; k++){
			for (int i=-1; i<=1; i++){
				for (int j=-1; j<=1; j++){
					vec2 X = x + vec2(j, i);
					float t = t + float(N);
					float T = t + float(k);
					vec3 a = n(X,T);
					vec2 o = floor(fract(a.xy) * 3.0) - vec2(1.0);
					vec3 b = n(X + o, T+ 1.0);
					vec2 m = mix(a.xy, b.xy, (t-a.z) / (b.z - a.z));
					float r = 0.4 * sin(3.14 * clamp((t-a.z) / (b.z - a.z), 0.0, 1.0));
					if (length(a.xy - b.xy) / (b.z - a.z) > 2.0) {
						r = 0.0;
					}
					c += vec4(vec3(0.5), 1.0) * max(0.0, 1.0 - dot(x-m, x-m) / (r*r));
				}
			}
		}
	}
	gl_FragColor = vec4(c.rgb*0.5 + vec3(0.0), 1.0);

}