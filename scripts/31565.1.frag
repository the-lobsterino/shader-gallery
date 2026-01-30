#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 m = mat2( 0.90,  0.110, -0.70,  1.00 );

float hash( float n )
{
    return fract(sin(n)*758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x); 
    //f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
		    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p )
{
    float f = 0.0;
    f += 0.50000*noise( p ); p = p*2.02;
    f -= 0.25000*noise( p ); p = p*2.03;
    f += 0.12500*noise( p ); p = p*2.01;
    f += 0.06250*noise( p ); p = p*2.04;
    f -= 0.03125*noise( p );
    return f/0.984375;
}

float cloud(vec3 p)
{
	p-=fbm(vec3(p.x,p.y,0.0)*0.5)*2.25;
	
	float a =0.0;
	a-=fbm(p*3.0)*2.2-1.1;
	if (a<0.0) a=0.0;
	a=a*a;
	return a;
}

vec3 f2(vec3 c)
{
	c+=hash(gl_FragCoord.x+gl_FragCoord.y*9.9)*0.01;
	
	
	c*=0.7-length(gl_FragCoord.xy / resolution.xy -0.5)*0.7;
	float w=length(c);
	c=mix(c*vec3(1.0,1.0,1.6),vec3(w,w,w)*vec3(1.4,1.2,1.0),w*1.1-0.2);
	return c;
}

float intersectPlane(vec3 origin, vec3 dir, vec3 point,vec3 normal)
{
    return dot(point-origin,normal)/dot(dir,normal);
}
void main( void ) {

	vec2 position = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(1.0);
	
	vec3 camera = vec3(0,0,time*.7);
	
	vec2 mouse2 = mouse * 2.0 - 1.0;
	vec3 lookdir = normalize(vec3(position.x,position.y+.2+2.*mouse.y*mouse.y*mouse.y,1));
	
	float dist1 = intersectPlane(camera, lookdir, vec3(0,16,0), vec3(0, -1, 0));
	float dist2 = intersectPlane(camera, lookdir, vec3(0,38,0), vec3(0, -1, 0));
	
	
	vec3 pos1 = camera + lookdir * dist1;
	vec3 pos2 = camera + lookdir * dist2;
	
	float stepsize = 0.1;
	float cursor = 0.0;
	float alphamax = 0.0;
	//for(int i=0;i<1;i++){
		float res = cloud(mix(pos1, pos2, cursor) * 0.1);
		vec3 newcolor = res * mix(vec3(0.9), vec3(0.9), cursor);	
		cursor += stepsize;
		color = mix(color, newcolor, res);
		alphamax = max(alphamax, res);
	//}
	color = mix(vec3(0.2, 0.5, 1.0), color, alphamax);
	gl_FragColor = vec4(color.xyzz * step(0.0, dist1 + dist2));
	if(length(gl_FragColor) < 0.1){
		gl_FragColor = vec4(.0,.25,.5,1);
	}
}