/*
 * Original shader from: https://www.shadertoy.com/view/WsXyW8
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const float iTimeDelta = 1. / 60.;

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
float rand(vec2 n) { return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453); }

float truc(vec3 p) {
	vec3 t;
	t.x = cos(p.x) + sin(p.y);
	t.y = cos(p.y) - sin(p.z);
	t.z = cos(p.z) + sin(p.x);
	return length(t) - 0.7;
}

float sminP(float a, float b , float s){   
    float h = clamp( 0.5 + 0.5*(b-a)/s, 0. , 1.);
    return mix(b, a, h) - h*(1.0-h)*s;
}

float displace(vec3 p) {
	p = texture(iChannel0, p.xy / 20.).rgb / 30.0;
	return p.x + p.y + p.z * 4.0 - 0.41;
}

float map(vec3 p) {
	float d = 100.0;
	d = sminP(truc(p), length(p), .1);
	d += displace(p);
	return d;
}

float intersect(vec3 ro, vec3 rd) {
	float t = 0.0;
	for (int i = 0; i < 30; i++) {
	float d = map(ro + rd * t);
	if (d <= 0.1) return t;
	t += d;
	}
	return 0.0;
}

vec3 normal(vec3 p) {
	float eps = 0.1;
	return normalize(vec3(
		map(p + vec3(eps, 0, 0)) - map(p - vec3(eps, 0, 0)),
		map(p + vec3(0, eps, 0)) - map(p - vec3(0, eps, 0)),
		map(p + vec3(0, 0, eps)) - map(p - vec3(0, 0, eps))
	));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 fc = fragCoord;
	if (rand(vec2(iTime, iTime*2.0)) > 0.98) fc.y -= rand(vec2(iTime, iTime*3.0))*30.0;
    vec2 uv = fc / iResolution.xy - 0.5;
	uv.x = uv.x * iResolution.x / iResolution.y;
	
	float t = 10.0 + iTime * 2.0;
	float cr = 32.0;
	
    vec3 ro = vec3(t+1.2, 2.0, t);
	vec3 ta = vec3(0.0);
	vec3 ww = normalize(vec3(ta - ro));
	vec3 vv = vec3(0,cos(t/3.0),sin(t/2.0));
	vec3 uu = normalize(cross(ww, vv));
    vv = normalize(cross(ww, uu));
	
	vec3 fcolor = vec3(0.0);
	for (int i = 0; i < 3; i++) {
	
		
		const float fov = 1.1;
		vec3 er = normalize(vec3(uv.xy, fov));
		vec3 rd = er.x * uu + er.y * vv + er.z * ww;
		
		float rnd = fract(sin(iTime * 20322.1232 + iTimeDelta)) / 13211.123;
		vec3 go = 0.015 * vec3(rnd - vec3(0.3) * 5.);
		vec3 gd = normalize( er + go );
		
		ro += go.x * uu + go.y * vv;
		rd += gd.x * uu + gd.y * vv;
		rd = normalize(rd);
		
		float d = intersect(ro, rd);
		vec3 color = vec3(0);
		
		if (d > 0.0) {
			vec3 pi = ro + rd * d;
			vec3 ni = normal(pi);
			color = vec3(1.0,1.0,0.9) + dot(rd, ni);
		}
        
        float ps1 = sin(uv.x + cos(t * sin(uv.x) * 2.0));
	    float ps2 = cos(uv.x + sin(t));
	    color = (ps1 > 0.0 && ps1 < 0.002)  ? vec3(0.0) : color;
	    color = (ps2 > 0.0 && ps2 < 0.01 && ps1 > 0.0)  ? vec3(0.0) : color;
	
		color *= min(1.0, 9./d);
		fcolor += color - pow(length(uv.xy), 8.0+cos(iTime)*2.0) * 2.0;
        fcolor += 0.3 * texture(iChannel0, uv.xy + vec2(0.0, 0.1*rand(vec2(iTime, iTime*0.7)))).rgb;
	}
	fragColor = vec4(fcolor / 3.,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}