#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float stem(vec3 pos) {
	vec3 pos2 = pos;
	pos2.y = max(abs(pos.y+1.5)-2.,0.);
	pos.y -= .5;
	return min(max(length(pos)-.17,pos.y-.09), length(pos2)-.1);
}

float center(vec3 pos) {
	vec3 pos2 = pos;
	pos2.y -= .4;
	return max(length(pos2)-.25,.59-pos.y);
}

float leaves(vec3 pos) {
	pos.xz = abs(pos.xz);
	pos.xz = vec2(max(pos.x,pos.z),min(pos.x,pos.z));
	pos.y -= .5;
	pos.y -= max(0.,length(pos.xz)*.7-dot(pos.xz,pos.xz)*.6);
	return max(abs(pos.y)-.005,
		   max(
		   -pos.x*.7+pos.z*.7+dot(pos.xz,pos.xz)*.4,
		   -pos.z+dot(pos.xz,pos.xz)*.4
		   )
	   )*.7;
	
}


float flower(vec3 pos) {
	return min(min(stem(pos),center(pos)),leaves(pos));
}

float sp(vec3 pos) {
	float y = pos.y+3.5;
	float s = 1.+5./(4.+y*y);
	pos.y += 1.-10./(6.+dot(pos.xz,pos.xz));
	pos.xz *= s;
	pos.xz = abs(pos.xz)-2.;
	pos.xz = abs(pos.xz)-1.;
	return flower(pos)/s;
}
	
vec3 fold(vec3 pos) {
	float y = pos.y+3.5;
	float s = 1.+5./(4.+y*y);
	pos.y += 1.-10./(6.+dot(pos.xz,pos.xz));
	pos.xz *= s;
	pos.xz = abs(pos.xz)-2.;
	pos.xz = abs(pos.xz)-1.;
	return pos;
}

void main( void ) {

	vec3 dir = normalize(vec3(( gl_FragCoord.xy - resolution*.5 ) / resolution.y, 1));
	vec3 pos = vec3(0,-1.,-7);

	float a = .6;
	
	mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
	float t = time * .3;
	
	mat2 rot2 = mat2(cos(t), -sin(t), sin(t), cos(t));

	pos.yz *= rot;
	dir.yz *= rot;

	pos.xz *= rot2;
	dir.xz *= rot2;

	
	for (int i = 0; i < 100; i++) {
		float dist = sp(pos);
		if (dist < 1e-5 || dist > 1e3) break;
		pos += dist*dir;
	}
	
	float dist = sp(pos);
	vec2 d = vec2(1e-3,0);
	vec3 norm = normalize(vec3(sp(pos+d.xyy),sp(pos+d.yxy),sp(pos+d.yyx))-vec3(dist));
	
	pos = fold(pos);
	vec3 color;
	float stemDist = stem(pos);
	float centerDist = center(pos);
	float leavesDist = leaves(pos);
	float specular = dot(reflect(dir, norm), vec3(0,1,0))*.5+.5;
	float diffuse = norm.y*.7+.7;
	
	if (dist > 1.) {
		color = vec3(.2,.5,.8)*(dir.y+1.);
	} else if (stemDist < centerDist && stemDist < leavesDist) {
		color = vec3(.35,.7,.1)*diffuse;
	} else if (centerDist < leavesDist) {
		color = vec3(.8,.7,.7)*diffuse + pow(specular, 10.)*.1;
	} else {
		color = vec3(.8,.7,.2)*diffuse + pow(specular, 100.);
	}

	gl_FragColor = vec4( color, 1.);

}