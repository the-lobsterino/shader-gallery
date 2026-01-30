// Necip's experimenting with wave simulation - breathing created

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415192

struct ray {
	vec3 o;
	vec3 d;
	float l;
};
	
mat2 rot(float angle)
{
	float s = sin(angle);
	float c = cos(angle);
	return mat2(c, -s, s, c);
}
	
float geo(vec3 p)
{
	float f = 0.4 + abs(sin(time*0.5));
	float model = 1.;
	
	// model = min(model, p.y + 0.35);	// ground
	for (float i=0.0;i<=2.0;i+=0.1) {		
		// model = min(model, length(p - vec3(p.x * sin(time*1.), i, 4.0 + 2.0*sin(time*0.1)))-0.1);
		// model = min(model, length(p - vec3(p.x*i *f*3., i, 0.5*(i+0.1) + i*8.*f)));
		
		model = min(model, length(p - vec3( p.x*i *f*3., i, 0.3*(i+0.1) + i*8.*f)));
		model = min(model, length(p - vec3( p.y*i *f*5., i, 0.5*(i+0.1) + i*5.*f)));
		model = min(model, length(p - vec3(-p.y*i *f*8., i, 0.5*(i+0.1) + i*5.*f)));
	}
	return model;
}

float march(ray r)
{
	for(int i = 0; i < 24; i++)
	{
		vec3 p = r.o + r.d * r.l;
		r.l += geo(p);
		if(r.l > 42.)
			break;
	}
	return r.l;
}

vec3 normal(vec3 p)
{
	vec2 off = vec2(0.001,0.0);
	float copy = geo(p);
	return normalize(copy - vec3(geo(p - off.xyy), geo(p - off.yxy), geo(p - off.yyx)));
}

float lighting(vec3 p)
{
	vec3 lPos = vec3(cos(time * 1.5) * 1.5, 2.,1.0);
	vec3 n = normal(p);
	vec3 lPosDiff = normalize(lPos - p);
	
	float light = clamp(dot(lPosDiff, n), 0.,1.);
	ray r;
	r.o = p + n * 0.01;
	r.d = lPosDiff;
	float copy = march(r);
	if(copy < length(lPosDiff - p))light*=.3;
	return light;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	uv.x *= resolution.x/resolution.y;

	ray r;
	r.o = vec3(0.);
	r.d = vec3(uv, 1.0);
	vec3 m = r.o + r.d * march(r);
	vec3 col = vec3(m.y); // vec3(lighting(m));
	
	// m += r.d*0.001;
	// col += vec3(m.y); // vec3(lighting(m));

	gl_FragColor = vec4(col,1.);

}