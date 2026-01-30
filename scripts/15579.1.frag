#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//fixed forest fire!
//(effectively a random walk)
//mouse bottom left to restart start it

//added some color and a little seasonal influence
//added some terrain - gonna need to get tricky with bitpacking to take this any further ;) 


#define fireprobability .00000001
#define treeprobability .09
#define ignitionpoint	.3

float hash(in vec2 uv);
float hash( float n );
float noise( in vec2 x );
void  sampleneumann(in vec2 uv, out vec4[9] s);
vec4  forestfire(in float tp, in float fp, in vec4[9] s);

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	vec4 s[9];
	sampleneumann(uv, s);
	
	
	//elevation
   	 uv = uv - .25;
	float g = .1 + 2. * abs(noise(uv*8.) * (noise(uv+uv*16.)*.89)*length(uv.x-uv.y));
	
	//"weather"
	float t = (1.-g)*noise(uv*vec2(8., 3.)+time*.5)+abs(sin(1.+time*.05)); //temp
	float w = g + noise((uv.xy*1.)+2.*time*.25+t*2.); //wind (more like barometric pressure)

   	 float ht = time * .0001;
	float fp = hash(vec2(hash(ht + uv-2.),hash(ht + uv.yx+3.)));
	float tp = hash(vec2(hash(ht + uv-5.),hash(ht + uv.yx+7.)));
	fp = step(fp, fireprobability) * t;
	tp = step(tp, treeprobability) * t;
	
	vec4 r = forestfire(tp, fp, s);

	r = time <= 2. || (mouse.x < .01) && (mouse.y < .01) ? step(length(vec2(resolution.x/resolution.y, 1.)), .25) * vec4(fp*5., tp, 0., fp) : r;
	
	//random tree color
	float rh = hash(uv*512.);
	r.y = min(r.y, rh);
	r.z = r.y > 0. ? r.y*rh*.5+(1.-t)*.25 : 0.;
	
	//weather effect on fire
	r.a = t < .1 ? r.a * .5 - w * .1 : r.a + r.a + abs(r.a - (t + w)) * .0008;
    r.a += .1 * (r.a * g * 4.);

	//terrain effects on trees
    r.y += abs((1.25-g) * .0001);
	r.y = g < .4 ? r.y - g * .0005 : r.y;
	r.y = g < .155 ? 0. : r.y;
	
    //lakes
	r.z = g < .15 ? .15+.25*noise(w+time*2.+uv*512.)*2.+w*.5 : r.z;
	r.z += .1 * g;
	
	gl_FragColor = r;
}//sphinx + mischeif @ sycamore

float hash(in vec2 uv){
  return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float hash( float n )
{
    return fract(sin(n)*43758.5453123);
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    p.x = mix(hash(n+ 0.), hash(n+  1.), f.x);
    p.y = mix(hash(n+57.), hash(n+ 58.), f.x);
    float res = mix(p.x, p.y, f.y);
    return res;
}

void sampleneumann(in vec2 uv, out vec4[9] s){
	float p = 1./resolution.x;
	vec3 o 	= vec3(-1., 0., 1.);
	
	s[0] = texture2D(backbuffer, uv + p * o.xx);
	s[1] = texture2D(backbuffer, uv + p * o.yx);
	s[2] = texture2D(backbuffer, uv + p * o.zx);
	
	s[3] = texture2D(backbuffer, uv + p * o.xy);
	s[4] = texture2D(backbuffer, uv + p * o.yy);
	s[5] = texture2D(backbuffer, uv + p * o.zy);
	
	s[6] = texture2D(backbuffer, uv + p * o.xz);
	s[7] = texture2D(backbuffer, uv + p * o.yz);
	s[8] = texture2D(backbuffer, uv + p * o.zz);
}

vec4 forestfire(in float tp, in float fp, in vec4[9] s)
{
	vec4 t = s[4];

	bool tree = t.y > 0.;
	bool fire = tree && t.a > 0.;
	
	//am i a tree that should spontaneously ignite?!
	t.a = tree && fire == false ? fp : 0.;
	
	//am i a tree on fire? burn or not
	t.y = tree && fire ? t.y - .1 : t.y;
	for(int i = 0; i < 9; i++)
	{
		//am I a tree with my neighbor trees burning?
		t.a += tree && s[i].y > 0. && s[i].a > 0. ? .1 + s[i].y * .01 : 0.;
	}
	
	t.a = t.a > ignitionpoint ? t.a : 0.;
	
	//burn
	t.y -= t.a * t.a;
	
	//grow if a tree, else try to spout
	t.y = tree ? t.y + .004 : tp * .0025;
	
	//fire color
	t.x = t.a < ignitionpoint * 1.001 ? 0. : t.x - .1 + t.a * 5.;
	t.y = t.a > .9 ? 1. : t.y;
	
	t = max(t, vec4(0.));	
	
	return t;
}