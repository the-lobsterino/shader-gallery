#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 rotationMatrix(vec3 axis, float angle)
{ 
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
        oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
        oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c);
}

vec3 getRay(vec2 uv){
	uv = uv * 2.0 - 1.0;
	mat3 rotmat = rotationMatrix(vec3(0.0, 1.0, 0.0), 0.0) * rotationMatrix(vec3(1.0, 0.0, 0.0), 0.0);
	return normalize(rotmat * vec3(uv.x, uv.y, -1.0));
}

vec3 closestPointOnLine(vec3 point, vec3 start, vec3 end) {
    vec3 a = point - start;
    vec3 b = end - start;
    float len = distance(a, b);
    return start + clamp(dot(a, b) / dot(b, b), 0.0, 1.0) * b;
}

float intersectPlane(vec3 origin, vec3 direction, vec3 point, vec3 normal)
{ 
	return dot(point - origin, normal) / dot(direction, normal); 
}

float peaksmoothstep(float peak, float val){
	return smoothstep(0.0, peak, val) * (1.0 - smoothstep(peak, 1.0, val));	
}

vec3 thrustengine(vec3 rayorigin, vec3 raydir, vec3 position, vec3 direction, float wide, float strength){
	vec3 closestPoint = closestPointOnLine(rayorigin, position - direction * 100.0, position + direction * 100.0);
	vec3 planenormal = normalize(rayorigin - closestPoint);
	vec3 result = vec3(0.0);
	mat3 rotmat = rotationMatrix(direction, 2.3999);
	for(int i=0;i<10;i++){
		planenormal = rotmat * planenormal;
		float planedst = intersectPlane(rayorigin, raydir, closestPoint, planenormal);
		//if(planedst <= 0.0) return vec3(0.0);
		vec3 point = rayorigin + raydir * planedst;
		float sourcedst = distance(position, point) * 2.0;
		vec3 reldir = normalize(point - position);
		float sourcedt = max(0.0, dot(direction, reldir));
		float att = 1.0 / (1.0 + sourcedst*sourcedst);
		float power = min(0.99, pow(sourcedt, 48.0 / wide) * att * strength); 
		result += vec3(1.0, 0.0, 0.0) * peaksmoothstep(0.1, power) / strength;
		result += vec3(0.0, 1.0, 0.0) * peaksmoothstep(0.2, power);
		result += vec3(0.0, 1.0, 1.0) * peaksmoothstep(0.99, power);
		result += vec3(0.0, 0.0, 1.0) * peaksmoothstep(0.1, power);
	}
	return result * 0.1;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 origin = vec3(0.0, 4.0, 4.0);
	vec3 dir = getRay(position);
	mat3 rotmat = rotationMatrix(vec3(0.0, 1.0, 0.0), mouse.x * 3.1415) * rotationMatrix(vec3(1.0, 0.0, 0.0), -mouse.y* 3.1415);
	vec3 color = vec3(0.0);
	for(float i=-3.0;i<3.0;i+=0.3){
		color += thrustengine(origin, dir, vec3(i, 1.0, 0.0), vec3(0.0, 1.0, 0.0), mouse.x * 2.0, (sin(time * 2.0 + i) * 0.5 + 0.5) * 10.0 * (mouse.y * 2.0));	
	}
	
	gl_FragColor = vec4( color, 1.0 );

}