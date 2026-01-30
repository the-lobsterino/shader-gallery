
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float Sphere(vec3 p, float r) 
{
	return length(p)*(2.0+sin(time*.01+r)*0.5) - r;
}

mat2 rotate2d(float angle) {
	vec2 cs = vec2( cos(angle), sin(angle) );
	return mat2(cs.x,-cs.y,cs.y,cs.x);
}

float Cube(vec3 p, vec3 b) 
{
	//p -= 0.5;
	p.xy *= ( rotate2d( sin(time * 0.1) ) * p.zx);
	//p += 0.5;
	
	//float l = length(b);
	return 1.-abs(sin(time))/length(max(abs(p) - b, 0.0));
}

float scene(vec3 p, float t, out vec3 color) 
{
	int c = -1;
	float coobs = 1.;
	float coobs_inner1;
	float multy = -1.0;
	for (int i = 0; i < 3; i++) 
	{
		t += float(i);
		
		mat3 r = mat3(1, 0, 0,  0, cos(t), -sin(t),  0, sin(t), cos(t));
		r *= mat3(cos(t), 0, sin(t),  0, 1, 0,  -sin(t), 0, cos(t));
		r *= mat3 (cos(t), -sin(t), 0,  sin(t), cos(t), 0,  0, 0, 1);
		
		coobs_inner1 = Sphere((p + vec3(-2 + i * 2, 0., 3.)) * r, 1.3) * multy;
		coobs_inner1 = max(Cube((p + vec3(-2 + i * 2, 0., 3.)) * r, vec3(1.0)), -coobs_inner1 * multy);
		if(coobs > coobs_inner1)
		{
			coobs = coobs_inner1;
			c = i;
		}
		multy *= -1.0;
	}
	if (c == -1) color = vec3(0.3, 0.5, 0.5);
	if (c == 0) color = vec3(0.0, 0.0, 0.8);
	if (c == 1) color = vec3(0.0, 0.8, 0.0);
	if (c == 2) color = vec3(0.8, 0.0, 0.0);
	return min(coobs, -p.z);	
}

vec3 normal(vec3 p, float t)
{
	vec3 c;
	float d = 0.001;	
	float dx = scene(p + vec3(d, 0.0, 0.0), t, c) - scene(p + vec3(-d, 0.0, 0.0), t, c);
	float dy = scene(p + vec3(0.0, d, 0.0), t, c) - scene(p + vec3(0.0, -d, 0.0), t, c);
	float dz = scene(p + vec3(0.0, 0.0, d), t, c) - scene(p + vec3(0.0, 0.0, -d), t, c);
	return normalize(vec3(dx, dy, dz));
}

void main(void) 
{
	vec3 pos = vec3(0, 0, -15);
	vec3 dir = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5)) * sin(time) * 1.0;
	vec3 col;
	
	float t = time / 1.5;
	float what = 0.;
	float dist = 0.;
	for (int i = 0; i < 100; i++) 
	{
		float dist = scene(pos, t, col);
		pos += dist * dir;
		what += dist;
		if ( dist < 1e-10 ) break;
	}
	vec3 nrm = normal(pos, t);
	gl_FragColor =
		vec4(col /(1.0 + nrm.y), 1.) -
		vec4((1.-dist)*nrm,1.0);//col / (1.0 + nrm.y), 1.);
	gl_FragColor.a = 1.0;
}