#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

vec2 aspect(vec2 p) {
	return -1.0 + 2.0*p;
}

vec2 deaspect(vec2 p) {
	return (p + 1.0)/2.0;
}

void main( void ) {
	vec2 p =  (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	vec2 mo = -2.0 + 4.0*mouse;
	
	if(p.y < -0.99) {
		vec2 pos = aspect(texture2D(backbuffer, vec2(0)).xy);
		vec2 opos = aspect(texture2D(backbuffer, vec2(.5, 0)).xy);
		
		if(time < 0.5) {
			pos = opos = vec2(0);
		}
		
		vec2 acc = 0.005*normalize(mo - pos);
		
		acc += vec2(0, -0.001);
		vec2 vel = pos - opos;
		
		vec2 npos = pos + vel + acc;
		
		if(npos.y < -0.87) {
			pos.y = -0.87;
			npos.y = pos.y - vel.y*0.7;
		} else if(npos.y > 0.87) {
			pos.y = 0.87;
			npos.y = pos.y - vel.y*0.7;
		}
		
		if(npos.x < -1.0) {
			pos.x = -1.0;
			npos.x = pos.x - vel.x*0.7;
		} else if(npos.x > 1.0) {
			pos.x = 1.0;
			npos.x = pos.x - vel.x*0.7;
		}
		
		
		if(p.x < 0.0) {
			gl_FragColor = vec4(vec3(deaspect(npos), 0), 1);
		} else {
			gl_FragColor = vec4(vec3(deaspect(pos), 0), 1);
		}
	} else {
		vec2 pos = aspect(texture2D(backbuffer, vec2(0)).xy);
		
		vec3 col = mix(vec3(1), vec3(0), smoothstep(0.03, 0.06, length(p - pos)));
		
		col = pow(col, vec3(1.0/2.2));
		gl_FragColor = vec4(col, 1);
	}
}