#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// attempt at iteratively building a 2d distance field
// starts with a b/w map and then grows distance info,
// every 2-3 seconds or so
// -- @paniq

float circle(vec2 p, float r) {
	return length(p)-r;
}

float map(vec2 p) {
	p = p*2.0-1.0;
	p.x *= resolution.x / resolution.y;
	
	float d = circle(p,0.5);
	d = max(d, -circle(p + vec2(0.5,0.0),0.3));
	return step(d, 0.0)*2.0-1.0;
}

float read_d(vec2 uv) {
	vec4 smp = texture2D(backbuffer, uv);
	
	float od = smp.a;
	return od*2.0-1.0;	
}

#define RANGE 1

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 px = vec2(1.0 / resolution);
	
	const float dfres = 1.0/128.0;
	
	float d = 0.0;
	if (int(mod(time*60.0,3.0*60.0)) == 0) {
		d = map(uv);
	} else {
		float ind = read_d(uv);
		
		if (ind == -1.0) {
			float best_d = -1.0;
			for (int i = -RANGE; i <= RANGE; ++i) {
				for (int j = -RANGE; j <= RANGE; ++j) {
					if ((i==0)&&(j==0)) continue;
					vec2 p = uv + vec2(i,j)*px;
					float v = read_d(p);
					if (v == -1.0) continue;
					if (v == 1.0) v = 0.0;
					v -= length(vec2(i,j))*dfres;
					best_d = max(best_d, v);
				}
			}
			d = best_d;
		} else if (ind == 1.0) {
			float best_d = 1.0;
			for (int i = -RANGE; i <= RANGE; ++i) {
				for (int j = -RANGE; j <= RANGE; ++j) {
					if ((i==0)&&(j==0)) continue;
					vec2 p = uv + vec2(i,j)*px;
					float v = read_d(p);
					if (v == 1.0) continue;
					if (v == -1.0) v = 0.0;
					v += length(vec2(i,j))*dfres;
					best_d = min(best_d, v);
				}
			}
			d = best_d;
		} else {
			d = ind;
		}
	}
	
	float dd = texture2D(backbuffer,uv).a;
	dd = (dd-0.5)*mix(1.0,resolution.y,mouse.y)+0.5;
	
	gl_FragColor = vec4( vec3(dd), d*0.5+0.5 );
}