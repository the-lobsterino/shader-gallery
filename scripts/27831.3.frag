#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D last;

//Smooth game of life like thing

//#define VIEW_KERNEL
//#define VIEW_LIFEFUNC

#define KERNEL_RADIUS 12
#define KERNEL_IN_SCALE 0.5

const float timestep = 0.5; //lower = more accurate/stable, higher = faster.

//Life function parameters.
const float gw = 0.08;
const float gsl = 0.26;
const float gel = 0.40;
const float gsh = 0.70;
const float geh = 0.95;
const float mxs = 0.12;
const float mxe = 0.60;

//Get the cell value at the specifed position.
float getValue(vec2 uv)
{
	return texture2D(last, mod(uv / resolution, 1.0)).a;	
}

//Get the kernel shell to fill at the specified offset.
vec2 getKernel(vec2 off)
{
	float l = length(off);
	float ks = float(KERNEL_RADIUS);
	vec2 k = vec2(0);
	
	k.x = 1.0 - step(ks * KERNEL_IN_SCALE, l);
	k.y = (1.0 - step(ks, l)) - k.x;
	
	return k;
}

//Sums up the filling of each kernel shell and returns the fraction percentage of each.
vec2 sumKernel(vec2 uv)
{
	vec2 tf = vec2(0); //Total fill counted for each shell.
	vec2 mf = vec2(0); //Maximum possible filling.
	
	for(int i = -KERNEL_RADIUS;i <= KERNEL_RADIUS;i++)
	{
		for(int j = -KERNEL_RADIUS;j <= KERNEL_RADIUS;j++)
		{
			vec2 off = vec2(i,j);
			vec2 k = getKernel(off);
			
			if(dot(off,off) > float(KERNEL_RADIUS*KERNEL_RADIUS))
			{
				continue;	
			}
			
			mf += k;
			tf += k * getValue(uv + off);
		}
	}
	
	return tf / mf;
}




const int oct = 8;
const float per = 0.5;
const float PI = 3.1415926;
const float cCorners = 1.0/16.0;
const float cSides = 1.0/8.0;
const float cCenter = 11.0/4.0;


float interpolate(float a, float b, float x){
	float f = (1.0 - cos(x*PI))*0.5;
	return a * (1.0 - f) + b * f;
}


float rnd(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453);
}


float irnd(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(rnd(vec2(i.x, i.y)),
		     rnd(vec2(i.x+1.0, i.y)),
		     rnd(vec2(i.x, i.y+1.0)),
		     rnd(vec2(i.x+1.0, i.y+1.0)));
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}


float noise(vec2 p){
	float t = 0.0;
	for(int i = 0; i < oct; i++){
		float freq = pow(2.0, float(i));
		float amp = pow(per, float(oct-i));
		t += irnd(vec2(p.x/freq, p.y/freq))*amp;
	}
	return t;
}





//Determines how "alive" a pixel is based on the filling of the inner(x)/outer(y) shells.
float lifeFunction(vec2 nm)
{
	float gmix = smoothstep(mxs, mxe, nm.y);
	
	float k = noise(nm*128.)*16.;
	float gs = mix(gsl+cos(.3*time+k+length(nm)*10.)*0.3, gsh, gmix);
	float ge = mix(gel, geh, gmix);
	
	return smoothstep(gs - gw, gs + gw, nm.x) - smoothstep(ge - gw, ge + gw, nm.x);
}




void main( void ) 
{
	vec2 uv = gl_FragCoord.xy;

	float lastVal = getValue(uv);
	
	vec2 cell = sumKernel(uv);
	
	float value = timestep * (lifeFunction(cell) - lastVal) + lastVal;
	
	value += 1.0 - step(1.0, distance(uv, mouse * resolution));
	
	value *= step(0.1, length(mouse));
	
	gl_FragColor = vec4( vec3( value + cell.x, value + cell.y, value * 0.5), value );
	
	#ifdef VIEW_KERNEL
	gl_FragColor.rgb = vec3(getKernel(uv - resolution/2.0),0.0);
	#endif
	#ifdef VIEW_LIFEFUNC
	gl_FragColor.rgb = vec3(lifeFunction(uv / resolution));
	#endif
	
	gl_FragColor.b += gl_FragColor.g/1.5;
	gl_FragColor = pow(gl_FragColor, vec4(3.33,2.,0.8,1));
	gl_FragColor.rgb = 0.5 + 0.04*(gl_FragColor.rgb-.5);
	
}

