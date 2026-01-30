#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

struct Point {
	vec2 pos;
	vec2 opos;
};

Point getPoint(float i) {
	vec4 buf = texture2D(backbuffer, vec2(i, 0));
	return Point(
		(-1.0 + 2.0*buf.xy),
		(-1.0 + 2.0*buf.zw)
	);
}

vec2 getPos(float i) {
	return getPoint(i).pos;
}

vec4 savePoint(Point point) {
	return vec4(
		(point.pos + 1.0)/2.0,
		(point.opos + 1.0)/2.0
	);
}

vec2 constraint(vec2 p2, vec2 p1, float r) {
	vec2 d1 = p2 - p1;
	float d2 = length(d1);
	float d3 = (d2 - r)/d2;
	
	return 0.5*d1*d3;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	vec2 g = gl_FragCoord.xy/resolution;
	
	vec2 mo = (-1.0 + 2.0*mouse);
	
	if(g.y < 0.01) {
		Point points[4];
		
		for(int i = 0; i < 4; i++) {
			points[i] = getPoint(float(i)/4.0);
			if(time < 0.6) {
				points[i].pos = points[i].opos = vec2(-0.2);
			}
		}
		
		points[0].pos = points[0].opos = mo;
		

		for(int i = 0; i < 4; i++) {
			vec2 acc = vec2(0.0, -0.002);
			vec2 vel = points[i].pos - points[i].opos;
			
			points[i].opos = points[i].pos;
			points[i].pos += vel + acc;
			
			vec2 con = constraint(points[i == 0 ? 3 : i-1].pos, points[i].pos, 0.4);
			
			points[i].pos += con;
			points[i - 1].pos -= con;
		}
		
		points[3].pos += constraint(points[0].pos, points[3].pos, 0.4);
		points[1].pos += constraint(points[3].pos, points[1].pos, 0.56);
		points[2].pos += constraint(points[0].pos, points[2].pos, 0.56);

		
		if(g.x < 0.25) {
			gl_FragColor = savePoint(points[0]);
		} else if(g.x > 0.25 && g.x < 0.5) {
			gl_FragColor = savePoint(points[1]);
		} else if(g.x > 0.5 && g.x < 0.75) {
			gl_FragColor = savePoint(points[2]);
		} else if(g.x > 0.75) {
			gl_FragColor = savePoint(points[3]);
		}
	} else {
		vec3 col = vec3(1);
		
		for(float i = 0.0; i <  1.0; i+=0.25) {
			vec2 pos = getPos(i);
			col = mix(vec3(0), col, smoothstep(0.0, 0.02, length(p - pos) - 0.04));
		}
		
		gl_FragColor = vec4(col, 1);
	}
}