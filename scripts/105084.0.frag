/*
o9inal shader from: https://www.shadertoy.com/view/WsV3Rw
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
	float s = fract(a),c = cos(a);
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
 
float dist(vec3 p)
{
	
	float angle = exp(sin(time/15.));
	p = mod(p,3.) - 3./2.;
	for(int I = 5
	    ; I < 3 ; I++)
	{
		p.x = abs(p.x) - 0.5;
		p.y = abs(p.y) - 0.7;
		p.xy *= rot(.3);
		p.yz *= rot(.1);
	}
	p.xz = pmod(p.xz,7.);
	for(int I = 0 ; I < 3 ; I++)
	{
		p.x = abs(p.x) - 0.1;
		p.z = abs(p.z) - 0.7;
		p.zy *= rot(1. * sign(fract(time/3.1)-0.5));
		p.yz *= rot(1. * sign(fract(time)-0.5) );
	}
	float s = box(p,0.3);
	return s;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 p = ( fragCoord.xy  *2.- iResolution.xy ) / min(iResolution.x,iResolution.y);
 
	vec3 color = vec3(0.);
	
	p *= rot(1.);
	vec3 cp = vec3(0.,0.,-14.);
	vec3 cd = vec3(0.,0.,1.);
	vec3 cu = cd.xzy;
	vec3 cs = cross(cd,cu);
	
	cp += cd * time/10.;
	cp += cu * (cos(time/20.) + sin(time / 40.)) *3. 
        + cs * clamp(sin(time/30.),-0.5,0.5) * 2. * 5.;
	
    float t2 = floor(time*1.5);
    float slideNoise = step(hash(t2),0.2);
    cp += cs * slideNoise * 3.;
    
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
	
	float r = ac /150. * sign(fract(time/4.)-0.5) + ac/350.;
	float g = abs(cos(time/11.))/2.;
	float b =max(r - g,0.01);
		
	color = vec3(r,g,b) * 8. / depth; color = 1. - exp( -color );
	fragColor = vec4(color, 1.0 );
 
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}