precision mediump float;

//rotating a box, using really simple matrix transformations
//I understood them in theory (sort of), but I never actually sat down and coded them.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 translate(mat3 start, vec2 point){
	start[0][2] += point.x;
	start[1][2] += point.y;
	return start;
}

mat3 rotate(mat3 start, float angle){
	mat3 r = mat3(cos(angle), -sin(angle),0.0,
		      sin(angle), cos(angle),0.0,
		      0.0,0.0,1.0);
	return start * r;
}

mat3 rotateAroundPoint(mat3 start, float angle, vec2 point){
	start = translate(start,-point);
	start = rotate(start, angle);
	return translate(start, point);
}

void main( void ) {

	vec3 pos = vec3(gl_FragCoord.xy,1.0);
	vec2 center = resolution.xy/2.0;
	
	//apply transformations here
	mat3 transform = mat3(1.0,0.0,0.0,
			      0.0,1.0,0.0,
			      0.0,0.0,1.0); //start with identity matrix
	transform = rotateAroundPoint(transform, time, center);
	
	pos = pos * transform;
	
	
	vec4 rect = vec4(center-200.0, center+200.0);
	
	vec2 hv = step(rect.xy, pos.xy) * step(pos.xy, rect.zw);
	float onOff = hv.x * hv.y;
	
	gl_FragColor = mix(vec4(0,0,0,0), vec4(1,1,1,0), onOff);
}