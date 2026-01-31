#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 29.0)) * 28.0;
}
 
vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+1.0)*x);
}
 
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
 
vec2 fade(vec2 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod289(Pi); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
     
    vec4 i = permute(permute(ix) + iy);
     
    vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
    vec4 gy = abs(gx) - 0.5 ;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
     
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
     
    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00 *= norm.x;  
    g01 *= norm.y;  
    g10 *= norm.z;  
    g11 *= norm.w;  
     
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
     
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

float fbm(vec2 P, float lacunarity, float gain)
{
    float sum = 0.0;
    float amp = 1.0;
    vec2 pp = P;
     
    for(int i = 0; i < 4; i+=1)
    {
        amp *= gain; 
        sum += amp * cnoise(pp);
        pp *= lacunarity;
    }
    return sum;
 
}
float govno(vec2 pos) {
	pos = vec2( fbm( pos + vec2(0.0,0.0),2.5,0.4),fbm( pos + vec2(5.2,1.3),2.5,0.4));
	return fbm(pos * 10. + 10., 2., 0.5);
}

void main(void) {
	/**
	 * Russia
	 */
	vec2 pos = surfacePosition;
	pos.y += (0.6 + pos.x) * sin(pos.x * 6.0 - time * 4.0) * 0.04;
	float shade = 0.8 + (0.6 + pos.x) * cos(pos.x * 6.0 - time * 4.0) * 0.2;

	vec3 color = vec3(0.0);
	if(abs(pos.x) < 0.5 && abs(pos.y) < 0.4) {
		if(pos.y < -0.15) color = vec3(0.8, 0.18, 0.22);
		else if(pos.y > 0.15) color = vec3(1.0);
		else color = vec3(0.0, 0.1, 0.57);
		color = mix(color, vec3(0.2, 0.1, 0.), smoothstep(-0.2, 0.3, govno(pos)));
	}

	gl_FragColor = vec4(color * shade, 1.0);
}