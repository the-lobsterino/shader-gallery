#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float fi (float t) {
	float delta = 6.0/29.0;
	if (t > delta) {
		return t * t * t;
	} else {
		return 3.0 * delta * delta * (t - 4.0 / 29.0);
	}
}

vec3 xyz(vec3 lab) {
	vec3 ret;
	float xn = 0.95047, yn=1.000, zn=1.08883;
	ret.x = xn * fi(1.0/116.0 * (lab.x + 16.0) + 1.0/500.0 * lab.y);
	ret.y = yn * fi(1.0/116.0 * (lab.x + 16.0));
	ret.z = zn * fi(1.0/116.0 * (lab.x + 16.0) - 1.0/200.0 * lab.z);
	return ret;
}

float gammamap(float c) {
	if (c < 0.0031308) {
		return 12.92 * c;
	} else {
		return pow(1.055 * c, 1.0/2.4) - 0.055;
	}
}

vec3 srgb(vec3 xyz) {
	mat3 mi = mat3( 3.2406, -0.9689,  0.0557,              
		       -1.5372,  1.8758, -0.2040, 
		       -0.4986,  0.0415,  1.057);
	vec3 color = mi * xyz;
	color.r = gammamap(color.r);
	color.g = gammamap(color.g);
	color.b = gammamap(color.b);
	return color;
}


vec3 postoxyz(vec2 pos) {
	vec3 lab;
	lab.x = 50.0 + 50.0 * sin(0.1 * time);
	vec3 white = xyz(vec3(lab.x, 0.0, 0.0));
	if (pos.x < 1.0) {
	lab.yz = -100.0 + 200.0 * pos;
	vec3 color = srgb(xyz(lab));
	if (color.r < 0.0 || color.g < 0.0 || color.b < 0.0 || color.r > 1.0 || color.g > 1.0 || color.b > 1.0 ) {
		return white;
	}
	return xyz(lab);
        } else {
		float r = length(vec2(pos.y - 0.5, pos.x - 1.5));
		if (r > 0.4 || r < 0.3) {
			return white;
		}
		float colorr = 30.0;
		vec2 m = vec2(mouse.x * resolution.x / resolution.y, mouse.y);
		vec2 colorc = -100.0 + 200.0* m;
		float theta = atan(pos.y - 0.5, pos.x - 1.5);
	        lab.y = colorc.x + colorr * cos(theta);
	        lab.z = colorc.y + colorr * sin(theta);
	        return xyz(lab);
        }
}

void main( void ) {
	vec2 position1 = (gl_FragCoord.xy / resolution.y );
	vec2 position2 = (gl_FragCoord.xy + vec2(0.0, 0.5)) / resolution.y;
	vec2 position3 = (gl_FragCoord.xy + vec2(0.5, 0.5)) / resolution.y;
	vec2 position4 = (gl_FragCoord.xy + vec2(0.5, 0.0)) / resolution.y;
	vec3 lab;
	vec3 xyz = 0.25 * (postoxyz(position1) + postoxyz(position2) + postoxyz(position3) + postoxyz(position4));
	gl_FragColor.rgb = srgb(xyz);
}