#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define time tan(time)
#define PI 3.14159

//smoothly interpolated random values
float value_noise(in vec2 uv) 
{
    const float k = 257.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(v*1.23456789)*9.18273645*v);
    l.zw    = l.zw*l.zw*(3.-2.*l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}

//copied from http://glslsandbox.com/e#21059.9
//fractal brownian motion - a sum of iterated sets of smoothly interpolated random values doubling in frequency and halving in amplitude across iterations (a pink noise power spectrum)
float fbm(float a, float f, vec2 uv, const int it)
{
    float n = 0.;
    vec2 p = vec2(.3, .7);
    for(int i = 0; i < 32; i++)
    {
        if(i<it)
        {
            n += value_noise(uv*f+p)*a;
            a *= .5;
            f *= 2.;
        }
        else
        {
            break;
        }
    }
    return n;
}

float toPolar(vec2 p) {
	float a = atan(p.y/p.x);
	if (p.x < 0.0) a += PI;
	return a;
}

void main( void ) {

	vec2 p = surfacePosition;
	float a1 = toPolar(p); //range 0 to 2*PI
	float a2 = atan(p.x,p.y); //range -PI to PI
	float a = a1;
	float r = length(p);
	
	vec3 col = vec3(0);
	
	//col = vec3(a1/PI/2.);
	//col = vec3(a2/PI+1.);
	
	col = vec3(step(0.,r-0.5-fbm(0.15,50.0,p,8)+0.15*abs(sin(a*3.0)*3.0)));
	
	gl_FragColor = vec4( col, 1.0 );
}