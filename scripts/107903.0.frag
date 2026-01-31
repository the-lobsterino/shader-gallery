#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141519
#define TAU 6.283185

// mercury sdf
// Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
float pModPolar(inout vec2 p, float repetitions)
{
	float angle = 2.0*PI/repetitions;
	float a = atan(p.y, p.x) + angle/2.;
	float r = length(p);
	float c = floor(a/angle);
	a = mod(a,angle) - angle/2.;
	p = vec2(cos(a), sin(a))*r;
	// For an odd number of repetitions, fix cell index of the cell in -x direction
	// (cell index would be e.g. -5 and 5 in the two halves of the cell):
	if (abs(c) >= (repetitions/2.0)) c = abs(c);
	return c;
}

vec2 rot(vec2 v, float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c)*v;
}

float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
} 

float star5( in vec2 p, float a, float size )
{
    p = rot(p,a);
    float fa = (mod( atan(p.y,p.x)*5.0 + PI/2.0, 2.0*PI ) - PI)/5.0;
    p = length(p)*vec2( sin(fa), cos(fa) );
    const vec2 k3 = vec2(0.951056516295,  0.309016994375); // pi/10
    return dot( vec2(abs(p.x)-size,p.y), k3);
}

void main( void )
{
	vec3 col0 = vec3(0,0,.7);
	vec3 col1 = vec3(1,.8,0);
	vec2 uv = (gl_FragCoord.xy *2.0 - resolution.xy)  / resolution.y;
	//uv.x *= dot(uv,uv);
	float dd = length(uv);
	uv = rot(uv,time*0.3);
	float c = pModPolar(uv,12.0);
	
	// render star
	uv.x -= fract(time*0.3);	//0.5+sin(time)*0.5;

	
	float c1 = pMod1(uv.x,0.5);
	
	float size = 0.03*dd;
	float d = star5(uv, (TAU/12.0)*-c+time, size);	// Pos,Ang,Size
	
	vec3 col = mix( col1, col0, smoothstep(0.0,0.015,d) )*clamp(2.0-dd,0.0,1.0);
	gl_FragColor = vec4(col,1.0);	
}