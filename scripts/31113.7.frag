#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//This work by Void Chicken is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
//This is the original, the one that copies me is breaking the rules of the license.
float hash(float n) { return fract(sin(n) * 1e4); }
float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);

    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}
mat4 rrm(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
float n (vec3 v) {
	
	return noise(v/10.0);	
}
bool isc (vec3 v, vec3 p) {
	if (length(v-p) < 10.0)
		return false;
	return n(v)>0.7;
}
vec3 ray(vec3 ro, vec3 rd, vec2 uv) {
	for (int i = 0; i < 6000;i++) {
		vec3 p = ro+rd*float(i)/10.0;	
		if (uv.x < 0.5+sin(time)/2.0)p=floor(p);
		if (isc(p, ro))
			return vec3(float(i)/1024.0, 0, 0);
	}
	return vec3(0);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) ;
	vec4 dir = vec4(uv-0.5, 1, 1);
	dir*=rrm(vec3(0, 1, 0), mouse.x*10.0 + 1.0);
	dir*=rrm(vec3(1, 0, 1), -mouse.y*10.0 + 1.0);
	
	gl_FragColor = vec4(ray(vec3(0, 1, -10.0+time*10.0), dir.xyz, uv) , 1.0 );

}