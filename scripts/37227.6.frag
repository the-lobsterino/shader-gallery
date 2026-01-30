#ifdef GL_ES
precision highp float; 
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

/*
Yo
What is it
it is fresnel effect resolved in 2d tex lookup format for X = roughness and Y = angle of view
this is very pbr useful
*/

float getthatfuckingfresnel(float reflectivity, vec3 normal, vec3 dir, float roughness){
    float base =  1.0 - abs(dot(normalize(normal), dir));
    float fresnel = (reflectivity + (1.0-reflectivity)*(pow(base, mix(5.0, 0.8, roughness))));
    float angle = 1.0 - base;
    return fresnel * (1.0 - roughness);
}
vec2 hasxh = vec2(0.0);
float rd(vec2 co){
	hasxh += co;
    return fract(sin(dot(hasxh,vec2(12.9898,78.233))) * 43758.5453);
	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float roughness = position.x;
	float angle = position.y;
	
	vec3 normal = vec3(0.0, 1.0, 0.0);
	vec3 camera = normalize(mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), angle));
	
	float fresnel = 0.0;
	hasxh = position * time;
	for(int i=0;i<128;i++){
		vec3 rdir = vec3(
			rd(vec2(1.123,2.2345)) * 2.0 - 1.0,
			rd(vec2(2.345,2.867)),
			rd(vec2(1.342,1.87)) * 2.0 - 1.0
		);
		
		vec3 ref = normalize(reflect(normalize(camera), normal));
		
		ref = normalize(mix(ref, rdir, roughness));
		
		fresnel += getthatfuckingfresnel(0.0, normal, ref, 0.0); 
	}
	fresnel /= 128.0;
	
	gl_FragColor = vec4( mix(texture2D(bb, position).r, fresnel, 0.3) );

}