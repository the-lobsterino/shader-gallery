/*
bezier curves on the gpu. To modify the shape, hover mouse over one of the highlighted points until it turns green
and drag mouse to desired position, then wait until it turns red again

there is enough branching to properly kill a baby in this shader. Enjoy.
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D backbuffer;
uniform vec2 mouse;
uniform vec2 resolution;

float distsqr(vec2 a, vec2 b) {
	a -= b;
	return dot(a,a);
}

float bezierDist (vec2 p0, vec2 p1, vec2 p2, vec2 point){
	vec2 A = p1 - p0;
	vec2 B = p0 - 2. * p1 + p2;
	vec2 C = p0 - point;
	
	float a = dot(B, B);
	float b = 3. * dot(A, B) / a;
	float c = (2. * dot(A, A) + dot(C, B)) / a;
	float d = dot(C, A) / a;
	float p = c - b * b / 3.;
	float q = b * (2. * b * b - 9. * c) / 27. + d;
	float p3 = p * p * p;
	float D = q * q + 4. * p3 / 27.;
	float offset = -b / 3.;
	
	float az = sqrt(D);
	float au = (-q + az) / 2.;
	float av = (-q - az) / 2.;
	float at = clamp(sign(au) * pow(abs(au), 1. / 3.) + sign(av) * pow(abs(av), 1. / 3.) + offset, 0., 1.);
	float at1 = 1. - at;
	float ar = distsqr(p0 * at1 * at1 + p1 * at1 * at * 2. + p2 * at * at, point);
		
	float bu = 2. * sqrt(-p / 3.);
	float bv = acos(-sqrt( -27. / p3) * q / 2.) / 3.;
	vec3 bt = clamp(bu * cos(bv + vec3(0., 2., 4.) * 1.0471975512) + offset, 0., 1.);
	vec3 bt1 = 1. - bt;
	float br = min(min(
		distsqr(p0 * bt1.x * bt1.x + p1 * bt1.x * bt.x * 2. + p2 * bt.x * bt.x, point),
		distsqr(p0 * bt1.y * bt1.y + p1 * bt1.y * bt.y * 2. + p2 * bt.y * bt.y, point)),
		distsqr(p0 * bt1.z * bt1.z + p1 * bt1.z * bt.z * 2. + p2 * bt.z * bt.z, point)
		);
	
	return sqrt( mix( br, ar, step(0.0,D) ));
}


float testCurve (vec2 p0, vec2 p1, vec2 p2, vec2 point){
	// trying to force the curve to pass through all 3 points (anyone)
	return bezierDist( p0, p1 - 2.0*(p2-p1), p2, point );
}

vec2 unpack (vec4 p){
	return vec2(
		dot(p.xy, vec2(1, 256)),
		dot(p.zw, vec2(1, 256))
	) * 255.;
}

vec4 pack (vec2 coord){
	return vec4(
		mod(coord.x, 256.),
		floor(coord.x / 256.),
		mod(coord.y, 256.),
		floor(coord.y / 256.)
	) / 255.;
}

void main (){
	vec2 mouseCoord = unpack(texture2D(backbuffer, vec2(0, 0) / resolution));
	vec2 p1 = unpack(texture2D(backbuffer, vec2(2, 0) / resolution));
	vec2 p2 = unpack(texture2D(backbuffer, vec2(3, 0) / resolution));
	vec2 p3 = unpack(texture2D(backbuffer, vec2(4, 0) / resolution));
	vec4 info = texture2D(backbuffer, vec2(1.5, 0.5) / resolution);
	float mouseTime = info.x * 255.;
	int selected = int(info.y * 255.);
	
	if (floor(p1 * resolution) == vec2(0, 0)){
		p1 = vec2(0.1, 0.1) * resolution;
		p2 = vec2(0.5, 0.5) * resolution;
		p3 = vec2(0.5, 0.9) * resolution;
	}
	
	if (ivec2(mouseCoord) != ivec2(mouse * resolution)){
		mouseTime = 0.;
	}else if (mouseTime < 255.){
		mouseTime += 1.;
	}
	
	if (selected != 0 && mouseTime > 50.){
		selected = 4;
	}else if (selected == 0){
		if (mouseTime > 20.){
			if (distance (p1, mouse * resolution) < 20.){
				selected = 1;
			}else if (distance (p2, mouse * resolution) < 20.){
				selected = 2;
			}else if (distance (p3, mouse * resolution) < 20.){
				selected = 3;
			}else{
				selected = 0;
			}
		}
	}else if (selected == 4){
		if (mouseTime == 0.){
			selected = 0;
		}
	}else if (selected == 1){
		p1 = mouse * resolution;
	}else if (selected == 2){
		p2 = mouse * resolution;
	}else{
		p3 = mouse * resolution;
	}
	
	vec2 coord = gl_FragCoord.xy;
	ivec2 icoord = ivec2(coord);
	
	if (icoord == ivec2(0, 0)){
		gl_FragColor = pack(mouse * resolution);
	}else if (icoord == ivec2(2, 0)){
		gl_FragColor = pack(p1);
	}else if (icoord == ivec2(3, 0)){
		gl_FragColor = pack(p2);
	}else if (icoord == ivec2(4, 0)){
		gl_FragColor = pack(p3);
	}else if (icoord == ivec2(1, 0)){
		gl_FragColor = vec4(mouseTime / 255., float(selected) / 255., 0, 1.);
	}else{
		float dist = 0.;
		
		dist = clamp(testCurve(p1, p2, p3, coord) - 10., 0., 1.);
		
		gl_FragColor = vec4(dist, dist, dist, 1.);
		
		float dot = clamp(distance(p1, coord) - 5., 0., 1.);
		gl_FragColor.xyz = gl_FragColor.xyz * dot + (1. - dot) * (selected == 1 ? vec3(0, 1, 0) : vec3(1, 0, 0));
		
		dot = clamp(distance(p2, coord) - 5., 0., 1.);
		gl_FragColor.xyz = gl_FragColor.xyz * dot + (1. - dot) * (selected == 2 ? vec3(0, 1, 0) : vec3(1, 0, 0));
		
		dot = clamp(distance(p3, coord) - 5., 0., 1.);
		gl_FragColor.xyz = gl_FragColor.xyz * dot + (1. - dot) * (selected == 3 ? vec3(0, 1, 0) : vec3(1, 0, 0));
	}
}