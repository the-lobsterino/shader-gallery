       //\
      // \\
     //   \\
    //     \\
   //   A   \\
  //         \\
 // ändrom3da \\
//_____________\\

// moving in a pseudo circle through the starfield...

precision highp float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
uniform sampler2D bb;  // backbuffer

#define TAU                  6.283185307179586
#define PI                   TAU / 2.
#define PHI 		     1.618033988749895
#define rot(a)               mat2( cos(TAU*a), -sin(TAU*a), sin(TAU*a), cos(TAU*a) )

#define SOMESMALLVALUE        0.00001
#define FOG_STRENGTH        1.20 
#define SPEED               1.20
//#define TAIL                0.30  // betwenn 0.0 and 1.0
#define STAR_DENSITY        1.00
#define RAINBOWSTAR_RATIO   10.    // every 10th star is a "rainbow star"
#define TIMEWAVE             1.0
#define COLORBAR              1
#define MAX_DIST 450.0
#define DIFFERENCE vec2(6.0, 6.0)
#define time time*0.8
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

float tw(float a)    {            return sin(a*time)*0.5 + 0.5; }
float tw(float a, float offset)     {        return sin(a*time-TAU*offset)*0.5 + 0.5; }

#define tw tw(1.0)

float rnd1 = 0.0;  // "random number"
vec3 ti = vec3(0.0);    // tile index whateva


const float sphereSize = 1.0;  // dont change that ;(



 // geometry  //
//  ======== //


float rectangleGUI( vec2 p1, vec2 size )
{
	float r = step( 0., p1.x )      * step( 0., p1.y ) *
		  step( p1.x, size.x )  * step( p1.y, size.y );
	return r;
}


 // coloration  //
//  ========== //


vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    // stolen from https://www.shadertoy.com/view/ll2GD3 palette shadertoy from iq:
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    return a + b*cos( TAU*( c*t + d ) );
}


 // GUI stuff  //
//  ========= //

vec3 colorBar( vec2 p1, vec3 c )
#define TILES 20.
{
	vec3 o = vec3(1.0);
	#ifdef COLORBAR
	#if (COLORBAR == 1)
	const float  border  =  0.002;
	vec2 rectPos         =  vec2(0.0, 0.0);
	vec2 rectSize        =  vec2(1.0, 0.030);
	o *= rectangleGUI(p1 - rectPos, rectSize);
	o *= cosPalette( (floor(TILES*p1.x + 0.5*TILES*time))/TILES, PAL1 );
        p1 += rectPos;
	return (o - c) * step( p1.y - border, rectSize.y + rectPos.y );  // minus c because the scene should not be over
	#endif
        #endif
	#ifndef COLORBAR
	return vec3(0.);
	#endif
}

float N31(vec3 p)
{
    vec3 a = fract(p/118899.99*vec3(1883.34,8889.34,37949.65));
    a+=dot(a,a+0.9);
    return fract((a.x*a.y*207.0214,a.y*a.z,a.z*a.x));
}

vec3 trans(vec3 p)
{
	float r = 4.;
	ti = floor((p + 6.0*0.5)/6.0);  // well..., tile index global variable
	return mod(p + r,2.0 * r) - r;	
}

float map(vec3 p)
{
	float t = 55.;  // alternativ: 6.*time;
	float size = 0.8;  // from 1.0 to 1.0 lol
	float rnd = N31(ti);  // random number
	if   (mod(rnd, 0.99) < STAR_DENSITY/ 1000.)     return length(trans(p)) - (size*sphereSize);
        else    				        return length(trans(p)) - 0.0;
}


void main(void)
{
	vec3  camPos = vec3(cos(-time)*400., 20000., sin(-time)*400.);   // movement
	
	// fragment position
	vec2 p = 0.9*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 p0 = gl_FragCoord.xy/resolution.xy;   // need that for the backbuffer later
	vec2 p1 = gl_FragCoord.xy / resolution.xy; p1.y = 1.0 - p1.y;       // not centered top to bottom for UI stuff
	
	// ray
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
	ray.xz *= rot(-time/TAU);
	
	//ray.xz *= rot(mouse.x*2.*PI);  // the camera rotation with the mouse
	
	// marching loop
	float distance = 0.0;
	float rLen = 0.0;
	vec3  rPos = camPos;

	for (int i = 0; i < 256; i++)
	{
		distance = map(rPos);
		rLen += distance;
		rPos = camPos + ray * rLen;
		if (rLen> MAX_DIST) break;
	}

        // define a random number which is tile specific	
	float rnd1 = N31(ti);
	
	// the fog
	float fog = 0.999 - pow(60./rLen, FOG_STRENGTH*1.25);
	
	// fragment color
	vec3 o = vec3(1.00 - 1.05*fog); //vec3 normal = getNormal(rPos); float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
	o *= 4.;
	
	// adding the bar
	vec3 c = o;
	c = colorBar(p1, c) + o;
	
	// adding the TAIL effect
	//c += 0.1*c + ((0.050*0.01)+0.2)*texture2D(bb, p0).xyz;   // just some backbuffer shyt
	gl_FragColor = vec4(c, 1.0);
}
