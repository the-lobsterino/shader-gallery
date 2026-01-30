#ifdef GL_ES
precision mediump float;
#endif

#define STEPS 32
#define OCTAVES 6
#define OBJECT_REFLECTIVITY 0.

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 color(vec3 pos, vec3 rd, int numReflections);

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

// exponential smooth min (k = 32);
float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float fbm(vec2 pos)
{
	float accum = .0;
	float amp = .5;

	for(int i = 0; i < OCTAVES; i++)
	{
		accum+= amp* noise(pos*4.);
		pos *= 1.6;
		amp = amp*.5;
	}
	
	return accum;
}

vec3 background(vec2 position)
{
	
	float cloud = fbm(position+time*.1);
	cloud = 1.-pow(2.7,-(cloud-.6)*4.);
	vec3 color = vec3(.2,.67,.96)*(1.-cloud) + cloud;
	return color;

}
vec3 light = vec3(1.,1.,-1.);

float map(vec3 pos)
{
	float a = distance(pos,vec3(mod(time,30.)-15.,noise(234.+time/6.)*10.-5.,0.))-1.;	
	
	a = smin( a,
		distance(pos,vec3(mod(time*1.3+18.,30.)-15.,noise(234.+time/8.)*10.-5.,0.))-.4,
		 .4
		);
	a = smin( a,
		distance(pos,vec3(mod(time*1.3+1.,30.)-15.,noise(522.+time/6.)*10.-5.,0.))-.8,
		 .7
		);	
	a = smin( a,
		distance(pos,vec3(mod(time*1.3+14.,30.)-15.,noise(443.+time/8.)*10.-5.,0.))-.5,
		 .8
		);	
	a = smin( a,
	distance(pos,vec3(mod(time*1.3+8.,30.)-15.,noise(545.+time/7.)*10.-5.,0.))-.7,
		 .9
	);
	a = smin( a,
	distance(pos,vec3(mod(time*1.2+4.,30.)-15.,noise(34543.+time/8.)*10.-5.,0.))-1.5,
		 .8
	);
	return a;
}

vec3 normal (vec3 p)
{
	const float eps = 0.0001;
 
	return normalize
	(	vec3
		(	map(p + vec3(eps, 0, 0)	) - map(p - vec3(eps, 0, 0)),
			map(p + vec3(0, eps, 0)	) - map(p - vec3(0, eps, 0)),
			map(p + vec3(0, 0, eps)	) - map(p - vec3(0, 0, eps))
		)
	);
}
float lighting(vec3 pos, vec3 l )
{
	vec3 n = normal(pos);
	return dot(l,n);
	
}

float specular(vec3 pos, vec3 l, vec3 rd)
{
	vec3 n = normal(pos);
	vec3 r = l - 2.*dot(l,n)*n;
	return pow(dot(r,rd),20.);

}

vec3 trace(vec3 ro, vec3 rd)
{
	vec3 pos = ro;
	for(int i = 0; i < STEPS; i++)
	{
		float objDist = map(pos);
		if(objDist < .0001) { 
			return pos;//vec3(lighting(pos,normalize(light))) ; 
		}
		pos += objDist*rd;
		
	}
	return vec3(0.,0.,0.); //background(vec2(rd.x,rd.y));
}

float fresnel (float n1, float n2, vec3 normal, vec3 incident)
{
        // Schlick aproximation
        float r0 = (n1-n2) / (n1+n2);
        r0 *= r0;
        float cosX = -dot(normal, incident);
        if (n1 > n2)
        {
            float n = n1/n2;
            float sinT2 = n*n*(1.0-cosX*cosX);
            // Total internal reflection
            if (sinT2 > 1.0)
                return 1.0;
            cosX = sqrt(1.0-sinT2);
        }
        float x = 1.0-cosX;
        float ret = r0+(1.0-r0)*x*x*x*x*x;
 
        // adjust reflect multiplier for object reflectivity
        ret = (OBJECT_REFLECTIVITY + (1.0-OBJECT_REFLECTIVITY) * ret);
        return ret;
}

vec3 reflection(vec3 pos)
{
	vec3 rd = normal(pos);
	
	vec3 reflecPos =  vec3(0.,0.,0.);
	
	for(int i = 0; i < STEPS; i++)
	{
		float objDist = map(pos);
		if(objDist < .0001) { 
			reflecPos = pos;//vec3(lighting(pos,normalize(light))) ; 
		}
		pos += objDist*rd;
		
	}
	vec3 bg = background(vec2(rd.x,rd.y));
	if(reflecPos == vec3(0.,0.,0.))
	{
		return bg;
	}
	vec3 a = mix(bg,vec3(lighting(reflecPos,normalize(light))),.3) ; 
	
	return a;
		

}
vec3 color(vec3 pos, vec3 rd)
{
	vec3 bg = background(vec2(rd.x,rd.y));
	if(pos == vec3(0.,0.,0.))
	{
		return bg;
	}
	vec3 a = bg + specular(pos,normalize(light),rd) ; 
	
	float f = fresnel(1.0,1.33,normal(pos),rd);
	a = mix(a,reflection(pos),f);
	
	return a;
}
void main( void ) {

	vec2 position = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0;
	position = position * resolution / max(resolution.x,resolution.y) ;

	
	

	vec3 col = vec3(0.0);
	
	vec3 from = vec3(0.0,0.0,-10.0);
	vec3 viewDir = normalize(vec3(position,1.));
	
	col = color(trace(from, viewDir),viewDir);

	gl_FragColor = vec4( vec3(col ), 1.0 );

}