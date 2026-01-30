#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159
#define MAX_ITER 32
#define TAU 6.28318
#define ITER 20
#define OCTAVES 3
#define STRETCH 10.0
#define SQUISH 1.0

// viral colors
const vec3 viralDiffuse = vec3( .199, .165, 0.2 );
const vec3 viralEps = vec3( .001, 0., 0. );
const int viralIter = 128;

const float StreakTau		= 6.2832;
const float StreakSpeed	= -2.;
const float StreakDensity	= .2;
const float StreakShape	= .01;

float viralSQ = sqrt(2.0)*0.5;


float shift = 1.1;
float off = 1.0;
float ti = time*2.;




float arc(vec2 pos,vec4 btrir,float ang,vec2 p)
{
	vec2 c = resolution/2.;
	
	float d = distance(p,vec2(c));
	
	float a = atan(p.x-c.x,p.y-c.y)+PI+ang;
	
	a = mod(a,TAU);
	
	float color = 0.0;
	
	if(a > btrir.x && a < btrir.y && d > btrir.z && d < btrir.w)
	{
		float diff = d-btrir.z;
		float rtrn = smoothstep(0.0,1.0,pow(sin(diff/16.*PI),0.0));
		
		float eb = 256.0;
		if(a < btrir.x+(PI/eb))
		{
			rtrn *= smoothstep(0.0,1.0,a/(PI/eb));
		}
				
		if(a > btrir.y-(PI/eb))
		{
			float ad = a - (btrir.y-(PI/eb));
			rtrn *= smoothstep(1.0,0.0,ad/(PI/eb));
		}
		return rtrn;
	}
	
	return 0.0;
}
void AssymetricWave( void ) {
	vec2 p0 = -1.0 + 2.0*gl_FragCoord.xy / resolution.xy;
	p0.y *= resolution.y/resolution.x;
	vec2 p = p0;

	p.x = mod(p.x*0.8, p.y);
	p.y = mod(p.y*0.5, p.x);
	
	p.x *= 0.1*sqrt(p0.x*p0.x+p0.y*p0.y);
	p.y *= 1.0*sqrt(p0.x*p0.x+p0.y*p0.y);
	
	//float s = 0.02+0.017*sin(time);
	
	p.x = mod( dot(p.y, p.x*5.0) - 0.1*time + 0.02*log(p0.x*p0.x+p0.y*p0.y), 0.5 );
	p.y = mod( dot(p.x, p.y*p.y*0.1), 0.5);
	float l = length(p-vec2(.0,.0));
	
	vec3 color = vec3(0.,0.,0.);
	float lum = 0.;
	lum = (abs(sin(l*100.0-ti)/2.+.8) - abs(sin(l*96.0+ti*0.0)+.8))-.5;
	lum = smoothstep(.3,.8,lum);
	color =  vec3( 0.2+0.8*(abs(sin(l*(100.0+shift*1.31)-ti)/2.+off) - abs(sin(l*(95.0+shift*0.1)+ti)+off))-.5 );
	color = 1.0-smoothstep(.2,.8,color);
	float v = 0.9 / (1.25 + 8.0*dot(p0, p0));
	vec4 finalColor =  vec4(color*v*1.0,1.);
	
	finalColor.r = 1.0 - finalColor.r;
	finalColor.b = 1.0 - finalColor.b;
	finalColor.g = 1.0 - finalColor.g;
	finalColor.a = 1.0 - finalColor.a;
	
	finalColor *= 0.25;
	gl_FragColor = finalColor;
}
float StreakRandom( vec2 seed ) {
	return fract(sin(seed.x-seed.y*1e3)*1e6);
}

float StreakCell(vec2 coord) {
	vec2 cell = fract(coord) * vec2(1.,.8) - vec2(0.,.2);
	return (1.-length(cell*2.-1.))*step(StreakRandom(floor(coord)*1e-3),StreakDensity)*2.;
}

void Streak( void ) {

	vec2 p = gl_FragCoord.xy / resolution - vec2(0.5);
	
	float a = fract(atan(p.x, p.y) / StreakTau);
	float d = length(p);
	
	vec2 coord = vec2(pow(d, StreakShape), a)*256.;
	vec2 delta = vec2(-time*StreakSpeed, .5);
	
	float c = 0.;
	for(int i=0; i<3; i++) {
		coord += delta;
		c = max(c, StreakCell(coord));
	}
	
	gl_FragColor = vec4(c*d);
}
float LavaRand(vec2 n) { 
	return fract(sin(dot(n, vec2(13, 5))) * 43758.5453);
}

float LavaNoise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(LavaRand(b), LavaRand(b + d.yx), f.x), mix(LavaRand(b + d.xy), LavaRand(b + d.yy), f.x), f.y);
}

float LavaFBM(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < OCTAVES; i++) {
		total += LavaNoise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total;
}

vec3 LavaTex(vec2 pos) {
	const vec3 c1 = vec3(0.1, 0.0, 0.0);
	const vec3 c2 = vec3(0.7, 0.0, 0.0);
	const vec3 c3 = vec3(0.2, 0.0, 0.0);
	const vec3 c4 = vec3(1.0, 0.9, 0.0);
	const vec3 c5 = vec3(0.1);
	const vec3 c6 = vec3(0.9);
	vec2 p = pos;
	float q = LavaFBM(p - time * -0.1);
	vec2 r = vec2(LavaFBM(p + q + time * 0.7 - p.x - p.y), LavaFBM(p + q - time * 0.0));
	vec3 c = mix(c1, c2, LavaFBM(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	//return vec3(c * cos(1.57 * pos.x));
	return c;
}


void LavaWave(void)
{
    // Mirror the y to get rid of join
    // since I'm not smart enough to tile the noise
    float y = gl_FragCoord.y > (resolution.y*0.5) ? gl_FragCoord.y : resolution.y-gl_FragCoord.y;
    // This will put back the join
    //y = gl_FragCoord.y;
    vec2 p = -1.0 + 2.0 * vec2(gl_FragCoord.x,y) / resolution.xy;
    float a = atan(p.x,p.y);
    float r = sqrt(dot(p,p));
    vec2 uv;
    uv.x = time+SQUISH/r;
    uv.y = a/3.14159265*STRETCH;
    vec3 col =  LavaTex(uv);
    gl_FragColor = vec4(col*r,1);
}

void WaveOut( void ) {
	
	vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    	vec2 uv;
	//shadertoy deform "relief tunnel"-gt
    	float r = sqrt( dot(p,p) );
    	float a = atan(p.y,p.x) + 0.9*sin(0.5*r-0.5*time);

	float s = 0.5 + 0.5*cos(7.0*a);
    	s = smoothstep(0.0,1.0,s);
    	s = smoothstep(0.0,1.0,s);
    	s = smoothstep(0.0,1.0,s);
    	s = smoothstep(0.0,1.0,s);

    	uv.x = time + 1.0/( r + .2*s);
    	  //uv.y = 3.0*a/3.1416;
	uv.y = 1.0*a/10.1416;

    	float w = (0.5 + 0.5*s)*r*r;

   	// vec3 col = texture2D(tex0,uv).xyz;

    	float ao = 0.5 + 0.5*cos(42.0*a);//amp up the ao-gt
    	ao = smoothstep(0.0,0.4,ao)-smoothstep(0.4,0.7,ao);
    	ao = 1.0-0.5*ao*r;
	
	
	//faux shaded texture-gt
	float px = gl_FragCoord.x/resolution.x;
	float py = gl_FragCoord.y/resolution.y;
	float x = mod(uv.x*resolution.x,resolution.x/3.5);
	float y = mod(uv.y*resolution.y+(resolution.y/2.),resolution.y/3.5);
	float v =  (x / y)-2.;
	gl_FragColor = vec4(vec3(.5-v,.5-v,.5-v)*w*ao,1.0);

}
// rotate position around axis
vec2 rotateElectronica(vec2 p, float a)
{
	return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
}

// 1D random numbers
float randElectronica(float n)
{
    return fract(sin(n) * 43758.5453123);
}

// 2D random numbers
vec2 rand2Electronica(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077 + time), cos(p.x * 391.32 + p.y * 49.077 + time)));
}

// 1D noise
float noise1(float p)
{
	float fl = floor(p);
	float fc = fract(p);
	return mix(randElectronica(fl), randElectronica(fl + 1.0), fc);
}

float voronoiElectronica(in vec2 x)
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	
	vec2 res = vec2(8.0);
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 b = vec2(i, j);
			vec2 r = vec2(b) - f + rand2Electronica(p + b);
			
			// chebyshev distance, one of many ways to do this
			float d = max(abs(r.x), abs(r.y));
			
			if(d < res.x)
			{
				res.y = res.x;
				res.x = d;
			}
			else if(d < res.y)
			{
				res.y = d;
			}
		}
	}
	return res.y - res.x;
}


float flicker = noise1(time * 2.0) * 0.8 + 0.4;

void Electronica(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = (uv - 0.5) * 2.0;
	vec2 suv = uv;
	uv.x *= resolution.x / resolution.y;
	
	
	float v = 0.0;
	
	// that looks highly interesting:
	//v = 1.0 - length(uv) * 1.3;
	
	
	// a bit of camera movement
	//uv *= 0.6 + sin(time * 0.1) * 0.4;
	uv = rotateElectronica(uv, sin(0.0 * 0.3) * 1.0);
	//uv += time * 0.4;
	
	
	// add some noise octaves
	float a = 0.6, f = 1.0;
	
	for(int i = 0; i < 3; i ++) // 4 octaves also look nice, its getting a bit slow though
	{	
		float v1 = voronoiElectronica(uv * f + 5.0);
		float v2 = 0.0;
		
		// make the moving electrons-effect for higher octaves
		if(i > 0)
		{
			// of course everything based on voronoi
			v2 = voronoiElectronica(uv * f * 0.5 + 50.0 + time);
			
			float va = 0.0, vb = 0.0;
			va = 1.0 - smoothstep(0.0, 0.1, v1);
			vb = 1.0 - smoothstep(0.0, 0.08, v2);
			v += a * pow(va * (0.5 + vb), 2.0);
		}
		
		// make sharp edges
		v1 = 1.0 - smoothstep(0.0, 0.3, v1);
		
		// noise is used as intensity map
		v2 = a * (noise1(v1 * 5.5 + 0.1));
		
		// octave 0's intensity changes a bit
		if(i == 0)
			v += v2 * flicker;
		else
			v += v2;
		
		f *= 3.0;
		a *= 0.7;
	}

	// slight vignetting
	v *= exp(-0.6 * length(suv)) * 1.2;
	
	// use texture channel0 for color? why not.
	//vec3 cexp = texture2D(iChannel0, uv * 0.001).xyz * 3.0 + texture2D(iChannel0, uv * 0.01).xyz;//vec3(1.0, 2.0, 4.0);
	
	// old blueish color set
	vec3 cexp = vec3(3.0, 2.0, 4.0);
		cexp *= 1.3;

	vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 2.0;
	
	gl_FragColor = vec4(col, 1.0);
}
float cViral( vec3 p )
{
	vec3 q = abs(mod(p+vec3(cos(p.z*0.5), cos(p.x*0.5), cos(p.y*0.5)),2.6)-1.0);
	float a = q.x + q.y + q.z - min(min(q.x, q.y), q.z) - max(max(q.x, q.y), q.z);
	q = vec3(p.x+p.y, p.y+p.z, p.z+p.x)*viralSQ;
	q = abs(mod(q,2000.0)-1.0);
	float b = q.x + q.y + q.z - min(min(q.x, q.y), q.z) - max(max(q.x, q.y), q.z);
	return min(a,b);
}

vec3 nViral( vec3 p )
{
	float o = cViral( p );
	return normalize( o - vec3( cViral( p - viralEps ), cViral( p - viralEps.zxy ), cViral( p - viralEps.yzx ) ) );
}

void ViralWave()
{
	float aspect = resolution.x / resolution.y;
	vec2 p = gl_FragCoord.xy / resolution * 2. - 1.;
	vec2 m = vec2(0.5,-0.5);
	p.x *= aspect;
	m.x *= aspect;
	
	vec3 o = vec3( 0., 0., time );
	vec3 s = vec3( m, 0. );
	vec3 b = vec3( 0., 0., 0. );
	vec3 d = vec3( p, 1. ) / 32.;
	vec3 t = vec3( .5 );
	vec3 a;
	
	for( int i = 0; i < viralIter; ++i )
	{
		float h = cViral( b + s + o );
		//if( h < 0. )
		//	break;
		b += h * 10.0 * d;
		t += h;
	}
	t /= float( viralIter );
	a = nViral( b + s + o );
	float x = dot( a, t );
	t = ( t + pow( x, 4. ) ) * ( 1. - t * .01 ) * viralDiffuse;
	t *= b.z *.16 ; 
	
	vec4 color = vec4( t*2.0, 1. );
	gl_FragColor = color;
	gl_FragColor.b = 0.0;
	gl_FragColor.g = 0.0;	
	
	gl_FragColor.r = 0.75 - gl_FragColor.r;
}
vec2 rotate(vec2 p, float a)
	{
	return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
	}

vec2 circuit(vec2 p)
	{
	p = fract(p);
	float r = 0.123;
	float v = 0.0, g = 0.0;
	float test = 0.0;
	r = fract(r * 9184.928);
	float cp, d;
	
	d = p.x;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 1000.0);
	d = p.y;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 1000.0);
	d = p.x - 1.0;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 1000.0);
	d = p.y - 1.0;
	g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 10000.0);
	
	for(int i = 0; i < ITER; i ++)
		{
		cp = 0.5 + (r - 0.5) * 0.9;
		d = p.x - cp;
		g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 160.0);
		if(d > 0.0)
			{
			r = fract(r * 4829.013);
			p.x = (p.x - cp) / (1.0 - cp);
			v += 1.0;
			test = r;
			}
		else
			{
			r = fract(r * 1239.528);
			p.x = p.x / cp;
			test = r;
			}
		p = p.yx;
		}
	v /= float(ITER);
	return vec2(v, g);
	}

float box(vec2 p, vec2 b, float r)
	{
	return length(max(abs(p) - b, 0.0)) -r ;
	}

float rand(float p)
	{
	return fract(sin(p * 591.32) * 43758.5357);
	}

float rand2(vec2 p)
	{
	return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5357);
	}

vec2 rand2(float p)
	{
	return fract(vec2(sin(p * 591.32), cos(p * 391.32)));
	}

vec3 sky(vec3 rd, float t)
	{
	float u = atan(rd.z, rd.x) / PI / 2.0;
	float v = rd.y / length(rd.xz);
	float fg = exp(-0.04 * abs(v));
	vec2 ca = circuit(vec2(u, (v - t * 3.0) * 0.03));
	vec2 cb = circuit(vec2(-u, (v - t * 4.0) * 0.06));
	float c = (ca.x - ca.y * 0.2) + cb.y * 0.7;
	vec3 glow = pow(vec3(c), vec3(0.9, 0.5, .3) * 2.0);
	vec2 cr = vec2(u, (v - t * 5.0) * 0.03);
	float crFr = fract(cr.y);
	float r = smoothstep(0.8, 0.82, abs(crFr * 2.0 - 1.0));
	float vo = 0.0, gl = 0.0;
	for(int i = 0; i < 6; i ++)
		{
		float id = float(i);
		vec2 off = rand2(id);
		vec2 pp = vec2(fract(cr.x * 5.0 + off.x + t * 8.0 * (0.5 + rand(id))) - 0.5, fract(cr.y * 12.0 + off.y * 0.2) - 0.5);
		float di = box(pp, vec2(0.2, 0.01), 0.02);
		vo += smoothstep(0.999, 1.0, 1.0 - di);
		gl += exp(max(di, 0.0) * -60.0);
		}
	vo = pow(vo * 0.4, 2.0);
	vec3 qds = vec3(1.0);
	vec3 col = mix(glow, qds, clamp(vo, 0.0, 1.0)) + vec3(0.5, 0.5, 0.5) * gl * 1.25;
	return col + (1.0 - fg);
	}

vec3 colorset(float v)
	{
	return pow(vec3(v), vec3(0.2, 0.4, 1.0) * 2.0);
	}

float snoise(vec3 uv, float res)
{
	const vec3 s = vec3(1e0, 1e2, 1e4);
	
	uv *= res;
	
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);

	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

	vec4 r = fract(sin(v*1e-3)*1e5);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	return mix(r0, r1, f.z)*2.-1.;
}

float rand3( float x, float y ){return fract( sin( x + y*0.1234 )*1234.0 );}

float interpolar(vec2 cord, float L){
   	float XcordEntreL= cord.x/L;
        float YcordEntreL= cord.y/L;
    
	float XcordEnt=floor(XcordEntreL);
        float YcordEnt=floor(YcordEntreL);

	float XcordFra=fract(XcordEntreL);
        float YcordFra=fract(YcordEntreL);
	
	float l1 = rand3(XcordEnt, YcordEnt);
	float l2 = rand3(XcordEnt+1.0, YcordEnt);
	float l3 = rand3(XcordEnt, YcordEnt+1.0);
	float l4 = rand3(XcordEnt+1.0, YcordEnt+1.0);
	
	float inter1 = (XcordFra*(l2-l1))+l1;
	float inter2 = (XcordFra*(l4-l3))+l3;
	float interT = (YcordFra*(inter2 -inter1))+inter1;
    return interT;
}

vec3 techtunnel(vec2 uv,float timeFactor)
	{
	uv /= resolution.xy;
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 ro = vec3(0.0, 0.0, -0.0);
	vec3 rd = normalize(vec3(uv, 1.6));
	float t = time * timeFactor;
	float tunnelDown = PI / 2.0;
	float lookAt = 0.0;
	rd.yz = rotate(rd.yz, 0.0);
	rd.xz = rotate(rd.xz, tunnelDown);
	rd.xy = rotate(rd.xy, tunnelDown);
	vec3 col = sky(rd, t);
	return pow(col, vec3(1.5)) * 1.3;
	}

#define NOISE_TUNNEL 12
void Gas(void)
{	
	float color = 0.0;
	
	for ( int i = 0; i < NOISE_TUNNEL; i++ ){
		float p = fract(float(i) / float(NOISE_TUNNEL) - time*.1 );
		float a = p * (0.90-p);
		color += a * (interpolar(gl_FragCoord.xy-resolution/2., resolution.y/pow(2.0, p*p*float(NOISE_TUNNEL)))-.5);
	}
	color += 0.75;
	gl_FragColor = vec4(0.2,0.2,0.2,1.0)*color*1.;
	
}

void Flame(void) 
{
	vec2 p = -.5 + gl_FragCoord.xy / resolution.xy;
	p.x *= resolution.x/resolution.y;
	
	float color = 3.0 - (3.*length(2.*p));
	
	vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
	
	for(int i = 2; i <= 7; i++)
	{
		float power = pow(2.0, float(i));
		color += (1.5 / power) * snoise(coord + vec3(0.,-time*.05, time*.05), power*16.);
	}
	gl_FragColor = vec4( color, pow(max(color,0.),0.5)*0.5, pow(max(color,0.),3.)*0.05 , 1.0);
}

void ViralScanning()
{
	vec2 uv = gl_FragCoord.xy;
	vec3 col;
	vec2 h = vec2(0.0, 0.0);
	col = techtunnel(uv,0.075);
	col += techtunnel(uv + h.xy,-0.075);
	col += techtunnel(uv + h.yx,-0.075);
	col += techtunnel(uv + h.xx,0.75);
	col /= 4.0;
	gl_FragColor = vec4(col, 1.0);		
	gl_FragColor.b *= 0.15 + (sin(time * 6.0) * 0.025);
	gl_FragColor.g *= 0.15 + (sin(time * 6.0) * 0.025);
	gl_FragColor.r *= 0.15 + (sin(time * 6.0) * 0.025);		
}

void ViralDetected()
{
	vec2 uv = gl_FragCoord.xy;
	vec3 col;
	vec2 h = vec2(0.0, 0.0);
	col = techtunnel(uv,0.075);
	col += techtunnel(uv + h.xy,-0.075);
	col += techtunnel(uv + h.yx,-0.075);
	col += techtunnel(uv + h.xx,0.75);
	col /= 4.0;
	gl_FragColor = vec4(col, 1.0);		
	gl_FragColor.b *= 0.0;
	gl_FragColor.g *= 0.0;
	gl_FragColor.r *= 0.25 + (sin(time * 15.0) * 0.25);		
}
void MissileSalvo()
{
	vec2 uv = gl_FragCoord.xy;
	vec3 col;
	vec2 h = vec2(0.0, 0.0);
	col = techtunnel(uv,0.75);
	col += techtunnel(uv + h.xy,0.05);
	col += techtunnel(uv + h.yx,0.05);
	col += techtunnel(uv + h.xx,-0.75);
	col /= 4.0;
	gl_FragColor = vec4(col, 1.0);		
	gl_FragColor.b *= 0.15;
	gl_FragColor.g *= 0.0;
	gl_FragColor.r *= 0.15 + (0.25* sin(time * 10.0));
}

void colorArc(vec4 inputCol)
{
	gl_FragColor = inputCol;
}

void main( void ) 
{
	vec4 inputColor = vec4(0.25,0.25,0.25,0.25);
	vec2 p = gl_FragCoord.xy;
	float arcPercentage = 30.0 / 100.0;
	float arcStart = 0.0;
	float arcEnd = 180.0;
	float color = 0.0;
	float arcP = (PI * ((2.0 / 3.0) * arcPercentage));
	float actualAngle = -15.0;
	float angleBase = (90.0 - actualAngle) * 0.0174532925;
	color += arc(resolution/2.,vec4(0.0,arcP,arcStart,arcEnd),angleBase,p);
	vec4 finalColor = vec4(vec3(color),1.0);
	gl_FragColor = finalColor;
	//if(finalColor.r + finalColor.g + finalColor.b > 0.0)ViralDetected();	
}