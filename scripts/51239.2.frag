#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float field21(in vec3 p, float s) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(time*10.) * 4500.0));
	float accum = s*3.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 12; ++i) {
		float mag = dot(p,p)*s*dot(p,1.0/p);
		p = abs(p) / mag + vec3(-.9, -.234560, -1.);
		float w = exp(-float(i) / 9.);
		accum += w * exp(-strength * pow(abs(mag / prev),1.2));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .8);
}


float field2(in vec3 p, float s) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(time*10.) * 4500.0));
	float accum = s*3.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 12; ++i) {
		float mag = dot(p, p)*s;
		p = abs(p) / mag + vec3(-.9, -1.0, -1.);
		float w = exp(-float(i) / 9.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.2));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .8);
}


void main( void ) {
	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	
	
	float col=0.2;
	
	
	col=field2(vec3(pos,1.0), 0.23);
	
	float col2=field21(vec3(pos,1.0), 0.23);
	
	
	//col=col+col2;
	
	
	
	
	
	vec3 color=vec3(col*0.2, col*col2*0.31, 0.89*col2*col2);
	
	
	
	
	
	gl_FragColor=vec4(color, 1.0);
	

}