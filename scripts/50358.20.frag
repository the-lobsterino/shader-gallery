// dogshit edit 4 u
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



mat3 camera(vec3 ro, vec3 ta, vec3 up)
{
	vec3 nz = normalize(ta - ro);
	vec3 nx = cross(nz, normalize(up));
	vec3 ny = cross(nx, nz);
	
	return mat3(nx, ny, nz);
}
float sdSphere( in vec3 p, in float r )
{
    return length(p)-r;
}
// signed box distance field
float sdBox(vec3 p, vec3 radius)
{
  vec3 dist = abs(p) - radius;
  return min(max(dist.x, max(dist.y, dist.z)), 0.0) + length(max(dist, 0.0));
}
float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}


float scene2(vec3 p)
{
	float y = 0.5+sin(time*2.0 + length(p.xz))*0.5;
	y = y*=abs(p.x*p.z)*.3;
	y = smoothstep(0.0,3.0,y*0.5);
	return p.y - y*y;
}
vec3 rotateY(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
}
vec3 rotateZ(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(ca * p.x - sa * p.y, sa * p.x + ca * p.y, p.z);
}


float objID;
float svobjID;

float scene(vec3 p)
{
	float waveStrength = .5;
	float frequency = 10.0;
	float waveSpeed = 0.85;
	p.z += 10.0;
	vec2 dv = p.xz*0.075;
	float d = length(dv);
	d = clamp(d*2.0,0.0,2.0);
	float d2 = d-2.0;
	d = d*d;
	float multiplier = d2*d2;
	float t = fract(time*waveSpeed)*6.2831;
	float s = sin(frequency*d-t);
	float y = s * waveStrength * multiplier * 0.25;
	float dist = p.y - y - 1.0;
	//float dist2 = sdSphere(p-vec3(0.0,y,0.0),2.0);
	p = rotateY(p ,-time*0.75);
	float dist2 = sdBox(p-vec3(0.0,2.0+y+(sin(-time*2.25)*0.65),0.0),vec3(1.5+y*0.2, 1.5, 1.5+y*0.2));
	objID = 0.0;
	if (dist2<=dist)
		objID=1.0;
	
	dist = smin(dist,dist2,0.35);

	
	return dist;
	

}


vec3 normal(vec3 p)
{
	float d = 0.01;
	return normalize(vec3(
		scene(p + vec3(d, 0.0, 0.0))- scene(p + vec3(-d, 0.0, 0.0)),
		scene(p + vec3(0.0, d, 0.0)) - scene(p + vec3(0.0, -d, 0.0)),
		scene(p + vec3(0.0, 0.0, d)) - scene(p + vec3(0.0, 0.0, -d))
	));
}

vec3 render(vec3 ro, vec3 rd)
{
	vec3 lightDir = normalize(vec3(1.5, 1.0, 0.5));

	float tmin = 0.1;
	float tmax = 120.;
	
	vec3 p;
	float t = tmin;
	for (int i = 0; i < 80; i++)
	{
		p = ro + t * rd;
		float d = scene(p);
		t += d*0.5;
		if (t > tmax)
			break;		
	}
	
	if (t < tmax)
	{
		svobjID = objID;
		vec3 nor = normal(p);
		vec3 c = vec3(0.3, 0.1, 0.5);
		if (svobjID>0.0)
			c=vec3(1.0,0.45,0.4);
		
		float dif = max(dot(nor, lightDir), 0.0);
		c += vec3(0.2) * dif;
		
		vec3 ref = reflect(rd, nor);
		float spe = max(dot(ref, lightDir), 0.0);
		c += vec3(3.0) * pow(spe, 16.);
		
		return c;
	}
	
	return vec3(0.0);
}

void main( void )
{

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	p.x *= resolution.x / resolution.y;

	vec3 ro = vec3(0.0, 10., -20.0);
	vec3 ta = vec3(0.0, 0.0, -10.0);
	
	vec3 rd = camera(ro, ta, vec3(0.0, 1.0, 0.0)) * normalize(vec3(p.xy, 1.0));
	
	vec3 c = render(ro, rd);
	
	gl_FragColor = vec4(c, 1.0);
}