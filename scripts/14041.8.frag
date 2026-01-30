#ifdef GL_ES
precision highp float;
#endif

//legendre polynomial spherical harmonic
//http://www.ppsloan.org/publications/StupidSH36.pdf 
//out of fashion, a bit expensive computationally, but handy

//encoder ported from : http://docs.unity3d.com/Documentation/ScriptReference/LightProbes-coefficients.html
//(also peter pike sloan, origionally, I think - him or robin green - via Cuba or Aras)

//sphinx

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct ray{
	vec3  o, p, d;	//origin, position, direction
};
    
struct light{
	vec3  p, d, c;	//position direction, color
	float a;	//attenuation
};
    
vec3 harmonic(in vec4[7] c, in vec4 n);
void assign(out vec4[7] c);
void encode(in vec3 p, in vec3 t, in float l, in vec3 n, out vec4[7] c);

float map(vec3 p);
vec3  derivate(vec3 p);
ray   trace(ray r);

void main() 
{
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 p = uv * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	
	ray r;
	r.d = normalize(vec3(p, -1.));
	r.o = vec3(0., 0., 1.);
	r.p = r.o;
	
	//trace scene
	r = trace(r);
	
	//normal
	vec3 n;
	if(distance(r.o, r.p) <= 4.){
		n = derivate(r.p);
	}
	
	//animation
	vec2 t = mouse + time * 1.5;
	mat2 rot = mat2(cos(t.x), sin(t.y), -sin(t.x), cos(t.y));
	vec2 rp = vec2(2., 2.) * rot;

	//lights
	light l0;
	l0.p = vec3(3., 2., 4.);
	l0.p.xz += rp;
	l0.d = normalize(-l0.p);
	l0.c = vec3(1., .0, .0);
	l0.a = .1/log(distance(l0.p, r.p));
	
	light l1;
	l1.p = vec3(-3., 0., 3.);
	l1.d = normalize(-l1.p);
	l1.c = vec3(0., 1., .0);
	l1.a = .1/log(distance(l1.p, r.p));
	
	light l2;
	l2.p = vec3(2., -2., 2.);
	l2.d = normalize(-l2.p);
	l2.c = vec3(.0, 0., 1.);
	l2.a = .1/log(distance(l2.p, r.p));
	
	light l3;
	l3.p = vec3(2., 3., 2.);
	l3.d = normalize(-l3.p);
	l3.c = vec3(.5, .5, .1);
	l3.a = .1/log(distance(l3.p, r.p));
	
	light l4;
	l4.p = vec3(-2., -3., 2.);
	l4.d = normalize(-l2.p);
	l4.c = vec3(.2, .2, .61);
	l4.a = .1/log(distance(l4.p, r.p));
	
	light l5;
	l5.p = vec3(2., -2., 2.);
	l5.d = normalize(-l2.p);
	l5.c = vec3(.725, .5, .1);
	l5.a = .1/log(distance(l5.p, r.p));
	
	//spherical harmonic coefficients
	vec4 c[7];
	encode(l0.c, l0.d, l0.a, n, c);
	encode(l1.c, l1.d, l1.a, n, c);
	encode(l2.c, l2.d, l2.a, n, c);
	encode(l3.c, l3.d, l3.a, n, c);
	encode(l4.c, l4.d, l4.a, n, c);
	encode(l5.c, l5.d, l5.a, n, c);
	//assign(c); //add precomputed coefficients
	
	//decode spherical harmonic
	vec3 h = harmonic(c, vec4(n, 1.));
	
	//lighting
	vec3 color = vec3(0.);
	if(distance(r.o, r.p) < 3.){
		//distance fog
		float d = log(1./distance(r.o, r.p));
		
		//specular
		float s;
		s += pow(max(dot(reflect(l0.d, n), r.o), .0), 32.);
		s += pow(max(dot(reflect(l1.d, n), r.o), .0), 32.);
		s += pow(max(dot(reflect(l2.d, n), r.o), .0), 32.);
		s += pow(max(dot(reflect(l3.d, n), r.o), .0), 32.);
		s += pow(max(dot(reflect(l4.d, n), r.o), .0), 32.);
		s += pow(max(dot(reflect(l5.d, n), r.o), .0), 32.);
		s *= 6.;
		
		color = d * d + h + h * s;
	}
	
	
       gl_FragColor = vec4(color, 1.);;
}//sphinx

vec3 harmonic(in vec4[7] c, in vec4 n){ 	
  
	vec3 l1, l2, l3;
    
	l1.r = dot(c[0], n);
	l1.g = dot(c[1], n);
	l1.b = dot(c[2], n);
	
	vec4 m2 = n.xyzz * n.yzzx;
	l2.r = dot(c[3], m2);
	l2.g = dot(c[4], m2);
	l2.b = dot(c[5], m2);
	
	float m3 = n.x*n.x - n.y*n.y;
	l3 = c[6].xyz * m3;
    	
	vec3 sh = vec3(l1 + l2 + l3);
	
	return clamp(sh, 0., 1.);
}

float map(vec3 p){
    	return length(p)-.5;
}

ray trace(ray r)
{
	float l, t = 0.;
  	for(int i = 0; i < 128; i++)
    	{
		l    = map(r.p);
		r.p += l * r.d;
        t   += l;
        if (l-.0001 <= 0. || t > 4.){ break; }
	}
	return r;
}

vec3 derivate(vec3 p){
	vec3 e = vec3(.001, 0., 0.);
	vec3 d = vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)
	);
	return normalize(d);
}

void assign(out vec4[7] c){
	c[0] = vec4(0.2, .37, .2, 0.05);
	c[1] = vec4(0.2, .13, .2, 0.02);
	c[2] = vec4(0.0,-.33, -.2, 0.145);
	c[3] = vec4(0.1, -.3, 0.2, 0.0);
	c[4] = vec4(0.1, -0.1, 0.1, 0.0);
	c[5] = vec4(0.2, 0.2, 0.2, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);
}

void encode(in vec3 p, in vec3 t, in float l, in vec3 n, out vec4[7] c) {
	
	//curve basis coefficients
        float k0 = 0.282094; // 1 / (2*sqrt(kPI))
        float k1 = 0.488602; // sqrt(3) / (2*sqrt(kPI))
        float k2 = 1.092548; // sqrt(15) / (2*sqrt(kPI))
        float k3 = 0.946174; // 3 * sqrtf(5) / (4*sqrt(kPI))
        float k4 = 0.546274; // sqrt(15) / (4*sqrt(kPI))
        float k5 = 0.333333; // 1.0/3.0
        
	//curve
	//http://en.wikipedia.org/wiki/Legendre_function
        float f[9];
        f[0] =  k0;
        f[1] = -t.y * k1;
        f[2] =  t.z * k1;
        f[3] = -t.x * k1;
        f[4] =  t.x * t.y * k2;
        f[5] = -t.y * t.z * k2;
        f[6] = (t.z * t.z - k5) * k3;
        f[7] = -t.x * t.z * k4;
        f[8] = (t.x * t.x - t.y * t.y) * k4;
		
        float kNorm =  2.956793; // 16*kPI/17
    
        float x = p.x * l * kNorm;
        float y = p.y * l * kNorm;
        float z = p.z * l * kNorm;
	
	c[0].x += f[3] * x;
	c[0].y += f[1] * x;
	c[0].z += f[2] * x;
	c[0].w += f[0] * x;
 			
	c[1].x += f[3] * y;
	c[1].y += f[1] * y;
	c[1].z += f[2] * y;
	c[1].w += f[0] * y;
 		
	c[2].x += f[3] * z;
	c[2].y += f[1] * z;
	c[2].z += f[2] * z;
	c[2].w += f[0] * z;	
		
	c[3].x += f[4] * x;
	c[3].y += f[5] * x;	
	c[3].z += f[6] * x;
	c[3].w += f[7] * x;
		
	c[4].x += f[4] * y;
	c[4].y += f[5] * y;
	c[4].z += f[6] * y;
	c[4].w += f[7] * y;
		
	c[5].x += f[4] * z;
	c[5].y += f[5] * z;
	c[5].z += f[6] * z;
	c[5].w += f[7] * z;
		
	c[6].x += f[8] * x;
	c[6].y += f[8] * y;
	c[6].z += f[8] * z;
}