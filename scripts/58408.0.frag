#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec3 orientation;
//#define time orientation.z

vec2 project4D(vec4 point) {
	float temp_w = 1./(1.-point.w);
	mat4 proj = mat4(vec4(1.*temp_w, 0., 0., 0.),
		               vec4(0., 1.*temp_w, 0., 0.),
		               vec4(1.*temp_w, 1.*temp_w, 1.*temp_w, 0.),
		               vec4(0., 0., 0., 1.));
	vec4 result = proj*point;
	return result.xy;
}

bool makeLine(vec2 frag, vec2 p1, vec2 p2, float thickness) {
	bool result = false;
	if (distance(p1, frag)+distance(p2, frag) - distance(p1, p2) < thickness)
	result = true;
	return result;
}/*
bool makeLine(vec2 frag, vec2 p1, vec2 p2, float thickness) {
 bool result = false;
 if(length(cross(vec3(p2 - p1, 0), vec3(p1 - frag, 0))) < thickness && distance(frag, (p1 + p2) / 2.0) < distance(p1, p2) / 2.0) {
  result = true;
 }
 return result;
}*/

void main(void) {
	vec2 uv = (gl_FragCoord.xy/resolution.y)*3.5 - 0.5 * vec2(resolution.x/resolution.y, 1.0)*3.5;//(gl_FragCoord.xy / resolution-0.5)*3.;
	vec3 color = vec3(.0, uv);
	gl_FragColor = vec4(0.);
	float c = cos(time);
	float s = sin(time);
	float thick = 0.0005;
	mat4 rot;
	/*mat4 rot = mat4(vec4(-s,c,0,c),
		              vec4(c,s,0,0),
		              vec4(0,0,1,0),
		              vec4(c,0,0,s));*/
	mat4 zw = mat4(vec4(1,0,0,0),
		             vec4(0,1,0,0),
		             vec4(0,0,c,s),
		             vec4(0,0,-s,c));
	mat4 yw = mat4(vec4(1,0,0,0),
		             vec4(0,c,0,s),
		             vec4(0,0,1,0),
		             vec4(0,-s,0,c));
	mat4 xw = mat4(vec4(c,0,0,s),
		             vec4(0,1,0,0),
		             vec4(0,0,1,0),
		             vec4(-s,0,0,c));
	mat4 xz = mat4(vec4(c,0,s,0),
		             vec4(0,1,0,0),
		             vec4(-s,0,c,0),
		             vec4(0,0,0,1));
	mat4 yz = mat4(vec4(1,0,0,0),
		             vec4(0,c,s,0),
		             vec4(0,-s,c,0),
		             vec4(0,0,0,1));
	mat4 xy = mat4(vec4(c,s,0,0),
		             vec4(-s,c,0,0),
		             vec4(0,0,1,0),
		             vec4(0,0,0,1));


	rot = zw*xy*mat4(vec4(1,0,0,0),
		          vec4(0,1,0,0),
		          vec4(0,0,1,0),
		          vec4(0,0,0,1));;
	float x1 = 0.25;
	float x2 = -0.25;
	float y1 = 0.25;
	float y2 = -0.25;
	float z1 = 0.25;
	float z2 = -0.25;
	float w1 = 0.25;
	float w2 = -0.25;
	vec2 d1 = project4D(rot*vec4(x1, y1, z1, w1));
	vec2 d2 = project4D(rot*vec4(x2, y1, z1, w1));
	vec2 d3 = project4D(rot*vec4(x1, y2, z1, w1));
	vec2 d4 = project4D(rot*vec4(x2, y2, z1, w1));
	vec2 d5 = project4D(rot*vec4(x1, y1, z2, w1));
	vec2 d6 = project4D(rot*vec4(x2, y1, z2, w1));
	vec2 d7 = project4D(rot*vec4(x1, y2, z2, w1));
	vec2 d8 = project4D(rot*vec4(x2, y2, z2, w1));
	vec2 p1 = project4D(rot*vec4(x1, y1, z1, w2));
	vec2 p2 = project4D(rot*vec4(x2, y1, z1, w2));
	vec2 p3 = project4D(rot*vec4(x1, y2, z1, w2));
	vec2 p4 = project4D(rot*vec4(x2, y2, z1, w2));
	vec2 p5 = project4D(rot*vec4(x1, y1, z2, w2));
	vec2 p6 = project4D(rot*vec4(x2, y1, z2, w2));
	vec2 p7 = project4D(rot*vec4(x1, y2, z2, w2));
	vec2 p8 = project4D(rot*vec4(x2, y2, z2, w2));
	if (makeLine(uv, d1, d2, thick) ||
		  makeLine(uv, d2, d4, thick) ||
		  makeLine(uv, d3, d4, thick) ||
		  makeLine(uv, d1, d3, thick) ||
		  makeLine(uv, d5, d6, thick) ||
		  makeLine(uv, d6, d8, thick) ||
		  makeLine(uv, d7, d8, thick) ||
		  makeLine(uv, d5, d7, thick) ||
		  makeLine(uv, d1, d5, thick) ||
		  makeLine(uv, d2, d6, thick) ||
		  makeLine(uv, d3, d7, thick) ||
		  makeLine(uv, d4, d8, thick))
	//if (distance(p, gl_FragCoord.xy) < 200.)
	gl_FragColor = vec4(1., 0., 0., 0.);
	if (makeLine(uv, p1, p2, thick) ||
		  makeLine(uv, p2, p4, thick) ||
		  makeLine(uv, p3, p4, thick) ||
		  makeLine(uv, p1, p3, thick) ||
		  makeLine(uv, p5, p6, thick) ||
		  makeLine(uv, p6, p8, thick) ||
		  makeLine(uv, p7, p8, thick) ||
		  makeLine(uv, p5, p7, thick) ||
		  makeLine(uv, p1, p5, thick) ||
		  makeLine(uv, p2, p6, thick) ||
		  makeLine(uv, p3, p7, thick) ||
		  makeLine(uv, p4, p8, thick))
	gl_FragColor = vec4(0., 0., 1., 0.);
	if (makeLine(uv, d1, p1, thick) ||
		  makeLine(uv, d2, p2, thick) ||
		  makeLine(uv, d3, p3, thick) ||
		  makeLine(uv, d4, p4, thick) ||
		  makeLine(uv, d5, p5, thick) ||
		  makeLine(uv, d6, p6, thick) ||
		  makeLine(uv, d7, p7, thick) ||
		  makeLine(uv, d8, p8, thick))
	gl_FragColor = vec4(0., 1., 0., 0.);
}