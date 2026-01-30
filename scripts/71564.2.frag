#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.141592;
const float pi2 = pi * 2.;

/*
float distanceFunction(vec3 pos){
	float d = length(pos) - 0.5;
	return d;
}
*/

float sdSphere(vec3 p, float r){
	float d = length(p) -r;
	return d;
}

float sdPlane(vec3 p){
	float d = p.y;
	return d;
}

float sdBox(vec3 p, float s){
	p = abs(p) - s;
	return max(max(p.x, p.y), p.z) ;
}

mat2 rot(float a){
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

vec2 pmod(vec2 p, float r){
	float a = atan(p.x, p.y) + pi/r;
	float n = pi2 / r;
	a = floor(a/n) * n;
	return p * rot(-a);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
	
	vec3 cameraPos = vec3(sin(time), sin(time), -5.);
	float screenZ = 2.5*time*0.00001*cos(time*2.);
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	float depth = 0.;
	float accum =0.;
	vec3 col = vec3(mod(abs(p.xy/.3), .5), 0.);
	
	for (int i=0; i<99; i++){
		vec3 rayPos = cameraPos + rayDirection * depth;
		rayPos = mod(rayPos-2., 4.);
		//float dist = sdSphere(rayPos, 0.5);
		//float dist = sdPlane(rayPos);
		float dist = max(abs(sdBox(rayPos, 0.5)), 0.02); 
		if (dist < 0.002 || depth > 80.){
			col = vec3(0., 0., fract(dist*3000.));
			break;
		}
		
		depth += dist * 0.5;
		accum += 0.005;
	}    
	
	/*
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	*/
	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	//gl_FragColor = vec4(col , 1.);
	gl_FragColor = vec4(0) + accum * (1. - exp(-0.001*depth*depth));
	//gl_FragColor = vec4(pmod(p, 4.)/.4, 0., 1.);
}