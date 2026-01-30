// author Sander from shadertoy
// gigatron for glslsandbox 

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 black = vec3(0);
const vec3 white = vec3(1);
const vec3 blue = vec3(0,0,192./255.);
const vec3 red = vec3(1,0,0);

bool cosign(vec2 t) {
	return (t.x > -55. && t.x < -11. && t.y > 0. && t.y < 7.) &&
		! (t.x > 3. && (t.x - 1.) > t.y);
}

vec3 commodore(vec2 p) {
	
	if(length(p) < 32.0 && length(p) > 24.0 && p.x < 13.0) {
		return blue;
	}
	
	vec2 t = p - vec2(20., 2.);
	if(cosign(t)) {
		return blue;
	}

	p.y *= -1.;
	
	vec2 t2 = p - vec2(20., 2.);
	if(cosign(t2)) {
		return red;
	}
	return white;
}

const float wave = 2.0;


void main()
{
	vec3 color;
	
	vec2 p = (gl_FragCoord.xy/resolution.xy)-vec2(0.5);
	p.x *= resolution.x/resolution.y;

	float t = time * 1.0;
	
	vec2 zp = p * 94.;
	
	vec2 displace = vec2( sin(13.*t - (p.y*wave)), cos(t - (p.x*wave)) );
	zp += 2. * displace;
	
	color = commodore(zp);

	if(color == white) {
		float interlace = mod(gl_FragCoord.y,2.);
		color = mix(black, white, 0.5 + 0.5 * interlace);
	}
	
	// stolen from:
	// https://www.shadertoy.com/view/4djGz1
	vec2 uv = gl_FragCoord.xy / resolution.xy*2.-1.;
	color = mix(blue, color, 0.5 + pow(max(0.,1.0-length(uv*uv*uv*vec2(1.,1.1))),1.));
	
	gl_FragColor = vec4(color, 1.);
}