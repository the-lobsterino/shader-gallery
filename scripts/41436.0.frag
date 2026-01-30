#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float calcTheta(float n, vec2 val) { 
	return n * atan(val.x,val.y);
}

float calcPhi(float n, float z, float r) {
	return n * acos(z / r);
}

float calcRSqr(vec3 val) {
	return val.x * val.x + val.y * val.y + val.z * val.z;
}

vec3 power(vec3 val, float n) {
	float r = sqrt(calcRSqr(val));
	float theta = calcTheta(n, val.xy);
	float phi = calcPhi(n, val.z, r);
	//return pow(r,n) * vec3(cos(theta) * cos(phi), sin(theta) * cos(phi), sin(phi));
	return pow(r,n) * vec3(cos(theta), sin(theta) * cos(phi), -sin(theta) * sin(phi));
}

vec3 c = vec3(0,0,0.);

float rr = 2.+2.*floor(mouse.x*8.);

float base = 4.;

const vec3 color1 = vec3(51./255.,1.,1.);
const vec3 color2 = vec3(0.,0.,1.);

const int iterations = 100;

void main( void ) {
	
	c.z = 0.00001;
	
	vec3 color = vec3(0);
	
	for(int i = 0; i < iterations; i++) {
		c = power(c, rr) + 3. * (vec3(gl_FragCoord.xy, 0.) / vec3(resolution.xx * 0.5, 1.) - vec3(1.0,0.7, 0.));
		if(c.x * c.x + c.y * c.y + c.z * c.z > pow(base, rr)) {
			color = vec3(i);
			break;
		}
		color = vec3(0);
	}

	
	gl_FragColor = vec4(mix(color1, color2, color/5.5), 1.);

}