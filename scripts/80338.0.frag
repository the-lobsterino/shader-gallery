#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D iChannel0,iChannel1, bb;

// https://www.shadertoy.com/view/MdXSzS
vec3   iResolution = vec3(resolution, 1.0);
float  iGlobalTime = 0.0073725*time;

#define iGlobalTime iGlobalTime + length(surfacePosition) + 1./length(-(mouse-0.5)*10.+surfacePosition)
//Colorful tessellation by nimitz (stormoid.com) 

//flat version
//#define flat



#define tim atan((iGlobalTime*0.25)/(iGlobalTime*0.35))
#define WRAP_ORDER (2.)+sin(23.23)*sin(0.478*iGlobalTime)*20.98242

float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
float noise( in vec2 x ){return texture2D(bb, x*.01).x;}

mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );
float fbm( in vec2 p )
{	
	float z=2.;
	float rz = 0.;
	p *= 0.25;
	for (float i= 1.;i < 6.;i++ )
	{
		rz+= (sin(noise(p)*5.)*0.5+0.5) /z;
		z = z*2.;
		p = p*2.*m2;
	}
	return rz;
}

vec2 field4( in vec2 x )
{
	vec2 n = floor(x);
	vec2 f = fract(x);

	vec2 m = vec2(5.,0.);
	//4 samples
	for(int j=0; j<=1; j++)
	for(int i=0; i<=1; i++)
    {
		vec2 g = vec2( float(i),float(j) );
		vec2 r = g - f;
		float minkpow = (mouse.y/iResolution.x)*3.+.8;
		float d = pow(pow(abs(r.x),minkpow)+pow(abs(r.y),minkpow),1./minkpow)*.5;
		d *= (mouse.x/iResolution.x)*1.4+.5;
		d = sin(d*10.+time*0.1);
		m.x *= d;
		m.y += d*1.2;
    }
	return pow(abs(m),vec2(0.8));
}

vec2 warp(vec2 uv, vec2 p, float offset)
{
	uv -= p;
	float minkpow = sin(23.*WRAP_ORDER);
	float d = pow(pow(abs(uv.x),minkpow)+pow(abs(uv.y),minkpow),1./minkpow);
	uv /= pow(d,2.)*1.-offset;
	uv += p;
	return uv;
}



void main()
{
	
	

	vec2 p = gl_FragCoord.xy / iResolution.xy-0.5;
	p.x += sin(sin(iGlobalTime*.16942)*surfacePosition.x*cos(surfacePosition.y*sin(cos(time))));
	p.y += sin(sin(iGlobalTime*.16942)*surfacePosition.y*cos(surfacePosition.x*sin(cos(time))));
	p*= 5.;
	
	#ifndef flat
	p = warp(p,vec2(0.),-.1);
	#endif
	
	vec2 rz = field4(p);
	
	vec3 col = sin(vec3(tan(.1+tim)*2.3,cos(tim*0.36)*1.7,1.42*sin(tim+0.2))*rz.y*1.4)*rz.x;
	col = pow(col,vec3(.99))*1.85;
	
	//lights
	vec3 ligt = normalize(vec3(sin(tim)*10.,1.,cos(tim)*10.));
	vec3 nor = normalize(vec3(cos(rz.y), .08, sin(rz.y)));
	
	//fbm variation on the normals
	nor.xz *= fbm(p*4.);
	vec3 bnor = nor;
	nor.yz *= fbm(p*2.);
	
	float dif = clamp(dot( nor,ligt ),0.0,1.0)*1.9;
	col *= sin(0.25+.784)*dif-.05;
	col *= 1.+3e2*pow(abs(dot(bnor,ligt)), 53.);
	
	//simple fbm "texturing"
	col *= fbm(p*4.5)*0.2+0.85;
	
	//vignetting
	col *= .74-pow(dot(p,p),3.)*0.9e-4;
	
	gl_FragColor = vec4(pow(col,vec3(0.6))-0.1,1.0);
	//return magin;
	
	vec2 uv = surfacePosition.xy*.5;

	float time = tim * .0051 + sin(0.02325*tim*sin(.025+.025*sin(time*.00135))/(length(uv.xy)+.07)+(0.023*tim))*1.-82.;
	float si = sin(time);
	float co = cos(time);
	mat2 ma = mat2(co, si, -si, co);

	float c = 0.0;
	float v1 = 0.0;
	float v2 = 0.0;
	
	for (int i = 0; i < 100; i++)
	{
		float s = float(i) * .035;
		vec3 p = s * vec3(uv, uv.yx*1.0);
		p.xy *= ma;
		p.yx *= ma;
		p += vec3(.22,.3, s-1.5-sin(time*.13)*.1);
		for (int i = 0; i < 8; i++)
		{
			p = abs(p) / dot(p,p) - 0.659;
		}
		v1 += dot(p,p)*.0015 * (1.8+sin(length(uv.xy*13.0)+.5-time*.2));
		v2 += dot(p,p)*.0015 * (1.5+sin(length(uv.xy*13.5)+2.2-time*.3));
		c = length(p.xy*.5) * .35;
	}
	
	float len = length(uv);
	v1 *= smoothstep(.7, .20, len);
	v2 *= smoothstep(.6, .42, len);
	
	float re = clamp(c, 0.0, 0.40);
	float gr = clamp((v1+c)*.25, 0.0, 1.0);
	float bl = clamp(v2, 0.0, 1.0);
	col *= vec3(re, gr, bl) + smoothstep(0.15, .0, len) ;

	gl_FragColor = vec4(pow(col,vec3(0.6))-0.1,1.0); 
} 