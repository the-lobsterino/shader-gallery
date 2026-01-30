#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 uv;

float sdl(vec2 a, vec2 b){
	float d;
	vec2 n, l;
	
	d = distance(a, b);
	n = normalize(b - a);
	l.x = max(abs(dot(uv - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(uv - a, n) - d * 0.5) - d * 0.5, 0.0);
	
	return (l.x+l.y);
}

float line(vec2 a, vec2 b, float w){
	return step(sdl(a, b), w);
}

float sline(vec2 a, vec2 b, float w){
	return smoothstep(w, 0., sdl(a, b));
}

vec2 rotate(vec2 v, float ang)
{
	mat2 m = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
	return m * v;
}

float set(float n){
	float r;
	const int iter = 8;
	float it = float(iter);
	for(int i = 0; i < iter; i++){
		if(float(i) < mouse.x * it && n > 0.){
			n *= 3.;
			float p = floor(n);
			n = 1. != p ? fract(n) : 0.;
			r++;
		}
	}
	
	return r/it;
}

vec3 set(vec2 n){
	vec3 r;
	const int iter = 32;
	float it = float(iter);
	for(int i = 0; i < iter; i++){
		n = abs(rotate(n, time * .05));
		n = n * (3.-n);
		n*= 3.;
		vec2 p = floor(n);	
		if(n.x > 0.){
			n.x = 1. != p.x ? fract(n.x) : 0.;
			r.x++;
		}
			if(n.y > 0.){
			n.y = 1. != p.y ? fract(n.y) : 0.;
			r.y++;
		}
		r.z += length(n)*float(i);
	}
	r.z = 1./r.z;
	r.xy /= it;
	r.xy *= r.z;
	return r;
}


vec3 set(vec3 n, vec3 d){
	const int iter = 3;
	float it = float(iter);
	vec3 r = it-n;
	for(int i = 0; i < iter; i++){
		n = n * (3.-n);
		n *= 3.;
		vec3 p = floor(n/3.);
		if(n.x > 0.){
			n.x = 1. != p.x ? fract(n.x) : 0.;
			r.x-=r.x*d.x;
		}
			if(n.y > 0.){
			n.y = 1. != p.y ? fract(n.y) : 0.;
			r.y-=r.y*d.y;
		}
			if(n.z > 0.){
			n.z = 1. != p.z ? fract(n.z) : 0.;
			r.z-=r.z*d.z;
		}
	}
	return n/r+atan(r/it);
}


void main( void ) {
	float s = 3.;
	uv = gl_FragCoord.xy/resolution * (s - s * .5) + (mouse * 2. - 1.) * s;
	uv.x *= resolution.x/resolution.y;
	uv = rotate(uv, time * .5);
	vec3 d = normalize(vec3(uv, length(s/uv)));
	vec3 p = vec3(uv.x, uv.y, length(uv));
	
	vec3 r = set(p, d);
	gl_FragColor = vec4(r, 0.);
}//sphinx