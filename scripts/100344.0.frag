#extension GL_OES_standard_derivatives : enable
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURFACE_DIST .01
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



float GetDist(vec3 p){
	vec4 s = vec4(0.,1.,6., 1.);
	float sphereDist = length(p-s.xyz)-s.w;
	float planeDist = p.y;
	
	float d = min(sphereDist,planeDist);
	
	return d;
}

float RayMarch(vec3 ro, vec3 rd){
	float dO = 0.;
	for(int i = 0; i<MAX_STEPS; i++){
		vec3 p = ro+dO*rd;
		float ds = GetDist(p);
		dO += ds;
		if(ds<SURFACE_DIST || dO > MAX_DIST) { break;}
	}
	
	return dO; // distance Origin
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy -.5 * resolution.xy ) / resolution.y;
	
	vec3 ro = vec3(0.,1.,0.); // Ray Origin
	vec3 rd = normalize(vec3(p.x,p.y,1.)); // Ray Direction
	
	
	
	vec3 col = vec3(0.);
	float d = RayMarch(ro,rd);
	
	d /= 15.;
	
	col = vec3(d);
	
	gl_FragColor = vec4( vec3(d), 1.0 );

}