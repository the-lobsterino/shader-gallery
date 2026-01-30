#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;

float PI = 1.1415926535;
const int dots = 100;

vec2 cpos( float ang, float dist) {
	return vec2(sin(ang)*dist, cos(ang)*dist);
}

float prnd( int fx, int fy) {
	float v = (sin(mouse.x*float(fx) - mouse.y*float(fy))*123.45);
	return abs(v - floor(v));
}

vec3 FluxIn(vec3 rgb, int flux) {
	if (flux == 0) {
		return vec3(rgb.r, rgb.g, rgb.b);
	} else if (flux == 1) {
		return vec3(rgb.r, rgb.b, rgb.g);
	} else if (flux == 2) {
		return vec3(rgb.g, rgb.r, rgb.b);
	} else if (flux == 3) {
		return vec3(rgb.g, rgb.b, rgb.r);
	} else if (flux == 4) {
		return vec3(rgb.b, rgb.r, rgb.g);
	} else {
		return vec3(rgb.b, rgb.g, rgb.r);
	}
}

vec3 FluxOut(vec3 rgb, int flux) {
	if (flux == 0) {
		return vec3(rgb.r, rgb.g, rgb.b);
	} else if (flux == 1) {
		return vec3(rgb.r, rgb.b, rgb.g);
	} else if (flux == 2) {
		return vec3(rgb.g, rgb.r, rgb.b);
	} else if (flux == 3) {
		return vec3(rgb.b, rgb.r, rgb.g);
	} else if (flux == 4) {
		return vec3(rgb.g, rgb.b, rgb.r);
	} else {
		return vec3(rgb.b, rgb.g, rgb.r);
	}
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pixel = 1. / resolution.xy;
	float time = time * length(position);
	float blur = .01;
	gl_FragColor = texture2D(backbuffer, position) * (1.0-blur);
	gl_FragColor += texture2D(backbuffer, position + vec2(1., 0.) * pixel) * (0.25*blur);
	gl_FragColor += texture2D(backbuffer, position + vec2(-1., 0.) * pixel) * (0.25*blur);
	gl_FragColor += texture2D(backbuffer, position + vec2(0., 1.) * pixel) * (0.25*blur);
	gl_FragColor += texture2D(backbuffer, position + vec2(0., -1.) * pixel) * (0.25*blur);

	if (gl_FragColor.a < 0.5) {
		gl_FragColor.rgba = vec4(1., 1., 1., 1.);
	}

	int flux = int(6.0*prnd(3424,4745));
	gl_FragColor.rgb = FluxIn(gl_FragColor.rgb, flux);
	gl_FragColor.r += 1./250.;
	gl_FragColor.g += ((gl_FragColor.r > 0.9)?1.:0.)/250.;
	gl_FragColor.b += ((gl_FragColor.g > 0.9)?1.:0.)/250.;
	gl_FragColor.rgb = FluxOut(gl_FragColor.rgb, flux);
	vec2 sp = position - 0.5;
	sp.y *= resolution.y / resolution.x;

	float range = (2.+1.*pow(prnd(2345,4623), 2.))/700.;
	
	float rate1 = 1.+25.*pow(prnd(2523,6343), 2.);
	float rate2 = 1.+35.*pow(prnd(5264,6345), 2.);
	float rate3 = 1.+40.*pow(prnd(3524,2367), 2.);
	float size1 = 0.125 + prnd(8949,24562)*0.2;
	float size2 = 0.45 - size1;
	float size3 = (prnd(634,2654) > 0.5) ? 0.0 : prnd(5623,6343)*0.25;
	if (size1>size2) {size1 -= size3;} else {size2-=size3;}
	
	vec3 tint = vec3(0.5+prnd(235,643),0.5+prnd(684,692),0.5+prnd(683,226));
	for (int n=0; n<dots; n++) {
		float tf = time * (1.0+20.0*prnd(3523,6574)) + float(n)/float(dots)*(0.04+prnd(5534,2543)*36.);
		vec2 dp = cpos(tf*rate1, size1);
		dp += cpos(tf*rate2, size2);
		dp += cpos(tf*rate3, size3);
		float d = length(dp - sp);
		if (d < range) {
			gl_FragColor.rgb -= (range-d)/range * 0.75 * tint;
		}
	}
	if(mouse.x+mouse.y < 0.10) gl_FragColor *= -1.;
	if(position.x+position.y < 0.10) gl_FragColor *= -1.;
}