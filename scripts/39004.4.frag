precision mediump float;
uniform vec2      resolution;
uniform float     time;

float rand(vec2 n) {
    return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i < 3; i++) 
    {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5;
    }
    return total;
}

void main() 
{
	vec2 speed = vec2(2.,1.);
	vec2 p = gl_FragCoord.xy * 20.0 / resolution.xx;
	float q = fbm(p - time * 0.2);
	vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y ));
	gl_FragColor = vec4(vec3(fbm(r)), 1.0);
	//float grad = gl_FragCoord.y / resolution.y;
	//gl_FragColor.xyz *= 1.0-grad;
}