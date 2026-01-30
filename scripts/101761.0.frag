/*
 * Original shader from: https://www.shadertoy.com/view/msBGWw
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define T (iTime)

float sid=0.0;
vec3 c0=vec3(0);

mat2 rot(float a)
{
	float c=cos(a), s=sin(a);
	return mat2(c,s,-s,c);
}

float dfo(vec3 p, float id)
{
	p.xy*=rot(p.z*sin(T/4.0+id)*(.01+id*0.1));
	p.z+=T;
	float s = 1.0/id/id;
	vec3 p2 = mod(p, s+s)-s;
	p+=sin(p.yzx+T);
	return length(p2)-s*0.5;
}

float df(vec3 p)
{
	float d=dfo(p,0.0);
	for (float i=.0; i<4.0; i+=1.)
	{
		d=max(d-.2, min(d, dfo(p, i)));
	}
	return d;
}

vec3 nf(vec3 p)
{
	vec2 e=vec2(0,0.5e-4);
	return normalize(vec3(
		df(p+e.yxx)-df(p-e.yxx), 
		df(p+e.xyx)-df(p-e.xyx), 
		df(p+e.xxy)-df(p-e.xxy)));
}

vec3 surf(vec3 pos)
{
	vec3 norm = nf(pos);
	vec3 emc = c0;
	vec3 shr = vec3(0);
	float pat = 0.0;
	float q = 0.0;
	q += smoothstep(0.9,0.98,sin((pos.z*0.5+T*3.14159)));
	pat += smoothstep(0.97-q,0.98,sin(94.0*df(pos*1.0+1.0)));
	pat += smoothstep(0.92,0.98,sin(94.0*df(pos*4.0+1.0)))*0.2;
	shr=emc * pat * (1.0+q*2.0) * max(.0,sin(pos.z*0.5+T));
	return shr;
  }

vec3 eval_surface(vec3 pos, vec3 dir)
{
	return surf(pos);
}

vec3 frame(in vec2 coord, int id)
{
	vec4 color = vec4(1.0);
	vec2 uv = (coord-iResolution.xy/2.0)/iResolution.yy;

	vec2 quv = uv-mod(uv,vec2(0.1));
	float q=fract(dot(quv, vec2(2.412,95.313))*31.3513);
	sid = T*0.3+q*0.25;
	sid -= fract(sid);
	sid = sin(sid*4123.0);
	
	c0 = mix(vec3(0.9,9,1.1), vec3(9,0.9,1.1), abs(sin(sid*4.04+uv.y*0.5)));
	c0 = mix(c0, vec3(1.5,.9,6), abs(sin(sid*9.53+uv.y*0.5)));

	vec3 pos = vec3(sin(sid)*0.35,cos(sid*4.0)*0.35,-4.0);
	vec3 dir = normalize(vec3(uv.xy, +1));
	float dt=0.01;
	float dist;
	
	dir.xy*=rot(sid);
	dir.xz*=rot(sin(sid*53.0)/4.0);
	dir.yz*=rot(sin(sid*9.0)/4.0);
	
	for (int i=0; i<150; i+=1){
	  dist = df(pos+dir*dt);
	  dt += dist;
	  if (dist<1e-4) break;
	}
	
	vec3 pos2 = pos+dir*dt;
  
	vec3 col = vec3(0);
	if (dist < 1e-3)
	{
	  col = surf(pos2);
	}
	
	vec3 dir2 = reflect(dir, nf(pos2));
	float dt2 = 1e-3;
	float dist2 = 0.0;
	for (int i=0; i<100; i+= 1){
	  dist=df(pos2+dir2*dt2);
	  dt2+=dist;
	  if (dist<1e-4) break;
   
	}
	vec3 pos3 = pos2+dir*dt2;
	vec3 col2 = c0;
	if (dist < 1e-3)
	{
	  col2 = surf(pos3);
	}
	col2 += mix(c0*4.0,col2,1.0/(1.0+dt2*dt2*.5e-3));
	
	float fres = pow(1.0+dot(dir, nf(pos2)),2.0);
	fres = clamp(fres,0.0,1.0);
	
	col=mix(col, col2, fres);
	col=mix(c0*4.0,col,1.0/(1.0+dt*dt*.5e-3));

	return vec3(col);
}

void mainImage(out vec4 color, in vec2 coord){

	color = vec4(0);

	for (int i=0; i<1; i+=1)
	{
		color.xyz += frame(coord, i);
	}

	float vignette = 1.0-pow(length((coord.xy-.5*iResolution.xy)/iResolution.yy),2.0);
	color.xyz *= clamp(vignette, 0.0, 1.0);
	color.xyz = 1.2*vec3(1.35,1.3,1.5)*color.xyz/(1.0+color.xyz);
	vec3 inv_gamma = vec3(1.0/2.2);
	color.xyz = pow(color.xyz, inv_gamma);
	color.xyz = clamp(color.xyz, 0.0, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}