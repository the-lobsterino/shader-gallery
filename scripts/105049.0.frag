/*
 * Original shader from: https://www.shadertoy.com/view/WsV3Rw
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define time iTime
const float pi = acos(-1.);
const float pi2 = pi * 2.;
 
float hash(float n)
{
    return fract(sin(n)*731.1);
}

mat2 rot(float a)
{
	float s = sin(a),c = cos(a);
	return mat2(s,c,-c,s);
}
 
vec2 pmod(vec2 p, float n)
{
	float a = atan(p.x,p.y) + pi/n;
	float r = pi2 / n;
	return p * rot(r);
}
 
float box(vec3 p , float s)
{
	p = abs(p) - s;
	return max(max(p.z,p.y),p.x);
}
 
float dist(vec3 p) // sdf
{
	
	float angle = exp(sin(time/15.));
    	p = mod( p, .5 ) - .25;
	float s = box(p,0.1);
	return s;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 p = ( fragCoord.xy  *2.- iResolution.xy ) / min(iResolution.x,iResolution.y);
 
	vec3 color = vec3(0.);
	
	p *= rot(1.);
	vec3 cp = vec3(0.,0.,-2.);
	vec3 cd = vec3(0.,0.,1.);
	vec3 cu = cd.xzy;
	vec3 cs = cross(cd,cu);
	
	// cp += cd * time * .001; // look like jelly
	
    float t2 = floor(time*1.5);
    float slideNoise = step(hash(t2),0.2);
    cp += cs * 3.;
    
	float target = 2.5;
	vec3 rd = normalize(vec3(cd * target + cs * p.x + p.y * cu));
	
	
	float ac = 0.;
	float depth = 0.0;
	
	for(int I = 0; I < 70 ; I++)
	{
		vec3 rp = cp + rd * depth;
		float d = dist(rp);
		
		d = max(abs(d),0.001);
        if(abs(d) <=  0.002)
        {
            d = 0.001;
            rd.xz *= rot(0.01);
        }
		ac += exp(-d * 3.);
		
		depth += d;
	}
	
	float r = ac /150. + ac/350.;
	float g = abs(cos(time/11.))/2.;
	float b =max(r - g,0.01);
		
	color = vec3( depth * .1 ); // not shaded
	fragColor = vec4(color, 1.0 );
 
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}