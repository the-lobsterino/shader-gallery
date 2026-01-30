#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);
const float TAU = PI * 2.0;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 hash33(vec3 p){     
    float n = sin(dot(p, vec3(7, 157, 113)));    
    return fract(vec3(2097152, 262144, 32768)*n); 
}

float worley2D(vec2 p){
	const float scale = 30.0;
	
	p = p * scale;
	
	vec2 fl = floor(p);
	vec2 fr = fract(p);
	
	float minDist = 1.0;
	
	for (int i = -1; i <= 1; i++){
		for (int j = -1; j <= 1; j++){
			vec2 neighbour = vec2(float(j), float(i));
			
			vec2 point = random2(fl + neighbour);
			
			vec2 diff = neighbour + point - fr;
			float dist = length(diff);
			
			minDist = min(minDist, dist);
		}
	}
	return 1.0 - minDist;
}

float worley3D(vec3 p){
	const float scale = 30.0;
	
	p = p * scale;
	
	vec3 fl = floor(p);
	vec3 fr = fract(p);
	
	float minDist = 1.0;
	
	for (int x = -1; x <= 1; x++){
		for (int y = -1; y <= 1; y++){
			for (int z = -1; z <= 1; z++) {
				vec3 neighbour = vec3(float(x), float(y), float(z));
				
				vec3 point = hash33(fl + neighbour);
				
				vec3 diff = neighbour + point - fr;
				float dist = length(diff);
				
				minDist = min(minDist, dist);
			}
		}
	}
	return 1.0 - minDist;
}

float fbm(vec2 p){
	float a = 0.5;
	float sc = 1.0;
	
	float noise = 0.0;
	
	for (int i = 0; i < 4; i++){
		noise += worley2D(p * sc) * a;
		a *= 0.5;
		sc *= 2.0;
	}
	
	return noise;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(smoothstep(0.5,0.8, 1.0 - fbm(position)));

	gl_FragColor = vec4(color, 1.0 );

}