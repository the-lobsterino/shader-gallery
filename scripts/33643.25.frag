#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( float n ){
    return fract(sin(n)*758.5453);
}
float noise( in vec3 x ){
    vec3 p = floor(x); 
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}

// lighting

mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s, 
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}
vec3 camera = vec3(0.0,12.0,0.0);
vec3 getPrimaryRay(vec2 uv){
	uv = uv * 2.0-1.0;
	vec3 p = normalize(vec3(uv.x,uv.y,1));
	p = rotationMatrix(vec3(1,0,0), clamp(mouse.y *2.0 -2.0, -3.14, 3.14)) * p;
	p = rotationMatrix(vec3(0,-1,0), mouse.x * 10.0) * p;
	return normalize(p);
}

vec3 getdomain(vec3 p){
	return p*0.4;
}

float floordield(vec3 p){
	return p.y - 2.5;
}

float grass(vec3 p){
	p.y = 0.0;
	p += noise(p + time);
	return ((abs(0.5 - noise(p*3.0))) * 2.0) - 0.1;	
}

float distfield(vec3 p){
	p = getdomain(p);
	return max(grass(p), floordield(p));	
}


vec3 raymarch(vec2 uv){
	vec3 r = getPrimaryRay(uv);
	float i = 0.0;
	float ld = 0.0;
	for(int ix=0;ix<161;ix++){
		vec3 p = camera + r * vec3(i);
		if(p.y < 0.0) break;
		float d = distfield(p);
		if(d < 0.1) {
			return vec3(0, p.y* 0.123, 0);
		}
		i += max(0.001, d);
	}
	return vec3(0);		
}
void main( void ) {
	//sun = normalize(vec3(sin(time), cos(time * 0.1) * 0.5 + 0.5 + 2.0, sin(time * 0.1654)));
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position * 2.0 - 1.0;
	position.y *= resolution.y / resolution.x;
	position = position * 0.5 + 0.5;

	vec3 color = raymarch(position);

	gl_FragColor = vec4(color, 1.0 );

}