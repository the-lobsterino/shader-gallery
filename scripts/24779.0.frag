#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PX = 2.0;
const float FO = 20.0;
const vec3 C_IN  = vec3(1.0, 0.7333, 0.3019);
const vec3 C_OUT = vec3(0.4196, 0.8431, 1.0);

const float PI = 3.141592654;

vec2 rotate(vec2 p)
{
	float Angle = time * 33.33 * PI / 180.0;
	mat2 ROT = mat2(	cos( Angle ), -sin( Angle ),
				sin( Angle ),  cos( Angle )
		      );
	return ROT * p;
}

float drawEllipse(vec2 c, vec2 r, bool filled)
{
	vec2 dp0 = gl_FragCoord.xy - c;
	vec2 dp = rotate(dp0);
	vec2 p = dp / r;
	float dist = length(p);
	float shape = 1.0 - step(1.0, dist);

	if(!filled)
	{
	vec2 r2 = r - vec2(PX);
	vec2 p2 = dp / r2;
	float dist2 = length(p2);
	shape *= step(1.0, dist2);
	}
	
	return shape;
}

void main( void ) {

	vec2 c = mouse * resolution.xy;

	vec2 rIn = vec2(100.0 * abs(sin(0.2*time)), 200.0 * abs(sin(0.3*time)));
	float shapeIn = drawEllipse(c, rIn, true);

	vec2 rOut = rIn + vec2(FO) * abs(sin(time + 1.0));
	float shapeOut = drawEllipse(c, rOut, false);

	vec3 result = mix(mix(vec3(0.0), C_OUT, shapeOut), C_IN, shapeIn);
	
	gl_FragColor = vec4( result, 1.0 );

}