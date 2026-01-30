#extension GL_OES_standard_derivatives : enable


precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Public uniforms

uniform float exposure;
uniform vec3 color;
uniform float speed;
uniform float seed;

#define Hash1(t) fract(sin(t*785.587)*124.421)

#define Rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

const float ITERATIONS = 6.;
const float TARGET_EXP = 5.e-2;
const vec3 COLOR = vec3(0.7,0.4,0.1);

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;

	float col = 0.;
	float tc = floor(time+1.);
	
	for(float i = 0.; i < ITERATIONS; i++)
	{
		float ii = i+1.;
		float it = ii/ITERATIONS;
		uv *= Rot(radians((ii*Hash1(tc*ii))*45.));
	
		float b = 1.-smoothstep(.0,mix(0.4,0.,fract(time)*it),length(uv.y));
		float l = mix(TARGET_EXP,0.,fract(time));
		
		col += (l/length(abs(uv.x)))*b;
	}
	
	col /= ITERATIONS;

	gl_FragColor = vec4( vec3( col*COLOR ), 1.0 );

}