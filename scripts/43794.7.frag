#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

const float zoom0 = .3;

const float sinit = .2;
const float smul = .9;
const int iterc = 40;

const float mtime0 = 4.2;

const float uvmul = 1. / (sinit * pow(smul, float(iterc)));

const float speed = .04/float(iterc);

const float anglemul = 2.;
const float angleshift = 1.;

const vec3 col_near = vec3(1., 0.4, 0.);
const vec3 col_far  = vec3(0., 0.6, 1.);
const float col_radius = .45;

const float cutoff_threshold = .35;
const float cutoff_sharpness = 20.;

const float sharpness = 4.;
const float value_mul = 1.1;

const int sins_iters = 20; //High values make it flicker for some reason
const float sins_amount = 0.02;
const float sins_freq = .2;


float mtime = mtime0 + speed*time;


void main( void ) {
	float mx = max( resolution.x, resolution.y );
	//vec2 uv = zoom * (( gl_FragCoord.xy - .5 * resolution.xy ) / mx + 2.*(mouse-0.5));
	vec2 uv = zoom0 * surfacePosition;

	float s = sinit;
	for (int i = 0; i < iterc; ++i) {
		float cmtime = mtime + 
			((i < sins_iters) ? (sins_amount*sin(sins_freq*float(i)*time)) : 0.);
		mat2 mat_rot = mat2(
			  cos(cmtime),  sin(cmtime)
			, sin(cmtime), -cos(cmtime)
		);

		uv = abs(uv) - s;
		uv *= mat_rot;
		s *= smul;
	}
	uv *= uvmul;
	
	float f = pow(exp(-col_radius*length(uv)), 2.);

	gl_FragColor = vec4(
		mix(col_far, col_near, f) * 
		clamp(pow(value_mul*abs(sin(angleshift+anglemul*atan(uv.y, uv.x))), sharpness), 0., 1.)
		/  vec3(1. + exp(cutoff_sharpness*(cutoff_threshold-length(uv))))
	, 1.0 );
}