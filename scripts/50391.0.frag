#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

vec2 project4D(vec4 point) {
	float temp_w = 1./(1.-point.w);
	mat4 proj = mat4(vec4(1.*temp_w, 0., 0., 0.),
		               vec4(0., 1.*temp_w, 0., 0.),
		               vec4(1.*temp_w, 1.*temp_w, 1.*temp_w, 0.),
		               vec4(0., 0., 0., 1.));
	vec4 result = proj*point;
	return result.xy;
}

/*bool makeLine(vec2 frag, vec2 p1, vec2 p2, float thickness) {
	bool result = false;
	if (distance(p1, frag)+distance(p2, frag) - distance(p1, p2) < thickness)
	result = true;
	return result;
}*/
bool makeLine(vec2 frag, vec2 p1, vec2 p2, float thickness) {
 bool result = false;
 if(length(cross(vec3(p2 - p1, 0), vec3(p1 - frag, 0))) < thickness && distance(frag, (p1 + p2) / 2.0) < distance(p1, p2) / 2.0) {
  result = true; 
 }
 return result;
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = resolution/2.+vec2(sin(time*2.4227), cos(time*3.4272))*resolution/12.;
	vec3 color = vec3(.0, uv);
	gl_FragColor = vec4(color, 1.0);
	//vec2 rot = vec2(sin(time), cos(time));
	vec2 p1 = vec2(resolution/2.-200.);//+rot*30.;
	vec2 p2 = vec2(p1.x, p1.y+200.);//+rot*40.;
	vec2 p3 = vec2(p1.x+200., p1.y);//+rot*65.;
	vec2 p4 = vec2(p3.x, p2.y);//+rot*45.;
	vec2 p5 = p1+100.;//+rot*50.;
	vec2 p6 = p2+100.;//+rot*35.;
	vec2 p7 = p3+100.;//+rot*55.;
	vec2 p8 = p4+100.;//+rot*15.;
	float thick = 0.0001;
	float zw = 0.;//sin(time*0.5)/16.;
	float zy = 0.;//cos(time)/24.;
	float zz = 0.;//sin(time*1.25)/12.;
	float c = cos(time);
	float s = sin(time);
	mat4 rot = mat4(vec4(1.,0.,0.,0.),
		              vec4(0.,1.,0.,0.),
		              vec4(0.,0.,c,-s),
		              vec4(0.,0.,s,c));
	//float rot = 1.;
	vec2 d1 = project4D(rot*vec4(0.4+zy, 0.4, 0.-zz, 0.));
	vec2 d2 = project4D(rot*vec4(0.5+zy, 0.4, 0.-zz, 0.));
	vec2 d3 = project4D(rot*vec4(0.4+zy, 0.6, 0.-zz, 0.));
	vec2 d4 = project4D(rot*vec4(0.5+zy, 0.6, 0.-zz, 0.));
	vec2 d5 = project4D(rot*vec4(0.4-zy, 0.4, 0.075-zz, 0.));
	vec2 d6 = project4D(rot*vec4(0.5-zy, 0.4, 0.075-zz, 0.));
	vec2 d7 = project4D(rot*vec4(0.4-zy, 0.6, 0.075-zz, 0.));
	vec2 d8 = project4D(rot*vec4(0.5-zy, 0.6, 0.075-zz, 0.));
	vec2 z1 = project4D(rot*vec4(0.4, 0.4+zy, 0., 0.1+zw));
	vec2 z2 = project4D(rot*vec4(0.5, 0.4+zy, 0., 0.1+zw));
	vec2 z3 = project4D(rot*vec4(0.4, 0.6+zy, 0., 0.1+zw));
	vec2 z4 = project4D(rot*vec4(0.5, 0.6+zy, 0., 0.1+zw));
	vec2 z5 = project4D(rot*vec4(0.4, 0.4+zy, 0.075, 0.1+zw));
	vec2 z6 = project4D(rot*vec4(0.5, 0.4+zy, 0.075, 0.1+zw));
	vec2 z7 = project4D(rot*vec4(0.4, 0.6+zy, 0.075, 0.1+zw));
	vec2 z8 = project4D(rot*vec4(0.5, 0.6+zy, 0.075, 0.1+zw));
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
		  makeLine(uv, d4, d8, thick) ||
		  makeLine(uv, z1, z2, thick) ||
		  makeLine(uv, z2, z4, thick) ||
		  makeLine(uv, z3, z4, thick) ||
		  makeLine(uv, z1, z3, thick) ||
		  makeLine(uv, z5, z6, thick) ||
		  makeLine(uv, z6, z8, thick) ||
		  makeLine(uv, z7, z8, thick) ||
		  makeLine(uv, z5, z7, thick) ||
		  makeLine(uv, z1, z5, thick) ||
		  makeLine(uv, z2, z6, thick) ||
		  makeLine(uv, z3, z7, thick) ||
		  makeLine(uv, z4, z8, thick) ||
		  makeLine(uv, d1, z1, thick) ||
		  makeLine(uv, d2, z2, thick) ||
		  makeLine(uv, d3, z3, thick) ||
		  makeLine(uv, d4, z4, thick) ||
		  makeLine(uv, d5, z5, thick) ||
		  makeLine(uv, d6, z6, thick) ||
		  makeLine(uv, d7, z7, thick) ||
		  makeLine(uv, d8, z8, thick))
	//if (distance(p, gl_FragCoord.xy) < 200.)
	gl_FragColor = vec4(color+0.5, 1.0);
}
