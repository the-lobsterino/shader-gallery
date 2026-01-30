#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Hash21(vec2 p) {
	p = fract(p * vec2(134.223, 195.95));
	p += dot(p, p + 134.21);
	return fract(p.x * p.y);
}

float Length(vec2 p, float ex) {
	p = abs(p);
	return pow(pow(p.x, ex) + pow(p.y, ex), 1.0 / ex);
}

vec4 Truchet(vec2 pos, vec3 color, float curve, float thickness, float pattern) {
	vec2 tile_id = floor(pos);
	float random = Hash21(tile_id);
	
	pos = fract(pos) - 0.5;
	
	// Randomly flip direction
	if (random < 0.5) pos.x *= -1.0;
	
	float corner_select = pos.x > -pos.y ? 1.0 : -1.0;
	vec2 circle_center = pos - vec2(0.5) * corner_select;
	float center_dist = Length(circle_center, curve);
	
	float edge_blur = 0.005;
	float edge_dist = abs(center_dist - 0.5) - thickness;
	float contour = smoothstep(edge_blur, -edge_blur, edge_dist);
	
	float angle = atan(circle_center.x, circle_center.y);
	
	float dist = cos(angle * 2.0) * 0.5 + 0.5;
	
	color *= mix(9.0, 1.0, dist);
	
	float checker = mod(tile_id.x + tile_id.y, 2.0) * 2.0 - 1.0;
	
	color *= 1.0 + sin(checker * angle * 30.0 + edge_dist * 100.0 - time * 5.0) * pattern * 0.3;
	
	return vec4(color, dist) * contour;
}


const int BIT_COUNT = 16;

int modi(int x, int y) {
    return x - y * (x / y);
}

int or(int a, int b) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
            result += n;
        }
        a = a / 2;
        b = b / 2;
        n = n * 2;
        if(!(a > 0 || b > 0)) {
            break;
        }
    }
    return result;
}

int and(int a, int b) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
        }

        a = a / 2;
        b = b / 2;
        n = n * 2;

        if(!(a > 0 && b > 0)) {
            break;
        }
    }
    return result;
}


int pow2(int a) {
	return int(pow(2.0, float(a)));
}

int lsh(int a, int b) {
	// logical shift left
	if (b > 15) {
	     a = 0; // if shifting more than 15 bits to the left, value is always zero
	} else {
	     a *= pow2(b);
	}
	return a;
}


int rsh(int a, int b) {
	// logical shift right (unsigned)
	if (b > 15) {
	    a = 0; // more than 15, becomes zero
	} else if (b > 0) {
	    if (a < 0) {
		// deal with the sign bit (15)
		a += -32768;
		a /= pow2(b);
		a += pow2(15 - b);
	    } else {
		a /= pow2(b);
	    }
	}
	
	return a;
}

void main(void) {
	int v = and(int(gl_FragCoord.x * gl_FragCoord.x + gl_FragCoord.y * gl_FragCoord.y), 255);
	
	if(v >= 128) v = 127 - (v - 128);
	
	float c = float(
		or(
			or(
				lsh(rsh(v, 1), 8),
				lsh(rsh(v, int(mod(time*30.0, 7.0))), 7)
			),
			lsh(rsh(v, 1), 8)
		));
	
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;

	vec3 color = vec3(0);
	
	float center_dist = length(uv);
	uv *= 5.0;
	uv += time / 4.0 ;
	
	float width = mix(0.1, -0.1, smoothstep(0.1, 0.5, center_dist));
	vec4 truchet1 = Truchet(uv, vec3(0.5, 0.0, 0.0), 2.0, width - 0.02, 0.0);
	vec4 truchet2 = Truchet(uv + 0.5, vec3(1.0, 1.0, 0.0), 2.5, width, 100.0);
	
	color = truchet1.a > truchet2.a ? truchet1.rgb * c: vec3(0.0);
	color += truchet1.a < truchet2.a ? truchet2.rgb : vec3(0.0);
	gl_FragColor = vec4(color, 1.0);
}