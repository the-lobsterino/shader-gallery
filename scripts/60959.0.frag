#ifdef GL_ES
precision highp float;
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

float star5( in vec2 p, float a, float size )
{
    p = rot(p,a);
    float fa = (mod( atan(p.y,p.x)*5.0 + PI/2.0, 2.0*PI ) - PI)/5.0;
    p = length(p)*vec2( sin(fa), cos(fa) );
    const vec2 k3 = vec2(0.951056516295,  0.309016994375); // pi/10
    return dot( vec2(abs(p.x)-size,p.y), k3);
}

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	uv.x += 2.75;
	uv.y += sin(time+uv.x)*0.4;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	d = smoothstep(0.0,0.05,d-0.55*CHS);
	return d;
}

void main( void )
{
	vec3 col0 = vec3(0,0,.7);
	vec3 col1 = vec3(1,.8,0);
	vec2 uv = (gl_FragCoord.xy *2.0 - resolution.xy)  / resolution.y;
	vec2 uv2 = uv;
	
	uv=rot(uv,time*0.2);
	float c = pModPolar(uv,12.0);
	// render star
	uv.x -= 0.85;
	float d = star5(uv, (TAU/12.0)*-c, 0.02);	// Pos,Ang,Size
	
	vec3 col = mix( col1, col0, smoothstep(0.0,0.015,d) );
	
	float d1= GetText(uv2*5.);
	col = mix(col+vec3(0.9,0.8,.3), col,d1);
	
	gl_FragColor = vec4(col,1.0);	
}