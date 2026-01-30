/*
 * Original shader from: https://www.shadertoy.com/view/XdcGzH
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
// shadertoy globals
float iTime;
vec3  iResolution;
const float e = 2.71828183;
// Protect glslsandbox uniform names
#define time        stemu_time
#define resolution  stemu_resolution

// --------[ Original ShaderToy begins here ]---------- //
//Public domain
#define PI 3.14159
#define A2B PI/360.
#define MaxIter 20
#define ScaleF 3.1
#define SquareLoop 1

vec2 c_mul(vec2 c1, vec2 c2)
{
	float a = c1.x;
	float b = c1.y;
	float c = c2.x;
	float d = c2.y;
	return vec2(a*c - b*d, b*c + a*d);
}
vec2 c_from_polar(float r, float theta) {
  return vec2(r * cos(theta), r * sin(theta));
}
vec2 c_to_polar(vec2 c) {
  return vec2(length(c), atan(c.y, c.x));
}

vec2 c_exp(float base, vec2 c) {
  return c_from_polar(pow(base, c.x), c.y * log(base));
}

float color(vec2 z, vec2 c) {
	float res = 1.0;
	// transform
	float l = length((z+c)*0.5);
	
	//z = c_exp(l,z);
	//z = c_from_polar(z.x,z.y);
	// Julia set
	bool flag = false;
	for (int i=0; i < MaxIter;i++) {
		
		z = c_mul(z,z);
		
		z += c;
		res = pow(length(z)/4.0,2.0);
		if (res > 1.0) {
			float a = 4.0/length(z);
			a = mod(a*4.,1.0);
			float b = float(i)/float(MaxIter);
			
			//gamma
			res = pow(mix(b, float(i+1)/float(MaxIter),a),0.5);
			
			flag = true;
			break;
		}
	}
	if (!flag) {
		res = 1.0-res;	
	}
	return (res*res);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 c = ((mouse.xy - vec2(0.5,0.5)) * 1.5 + vec2(-0.85,0.3)*0.0);
	
	vec2 uv = ScaleF*(fragCoord.xy-0.5*iResolution.xy) / iResolution.x;
   
	
	float p = color(uv,c);
	fragColor = vec4(p, p, p, 1.0);
}


#undef time
#undef resolution

void main(void)
{
  iTime = time;
  iResolution = vec3(resolution, 0.0);

  mainImage(gl_FragColor, gl_FragCoord.xy);
}