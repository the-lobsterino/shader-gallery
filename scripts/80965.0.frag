       //\
      // \\
     //   \\
    //     \\
   //   A   \\
  //         \\
 // ändrom3da \\
//_____________\\

// just played around a bit...

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

const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

float tw(float a)    {            return sin(a*time)*0.5 + 0.5; }
float tw(float a, float offset)     {        return sin(a*time-TAU*offset)*0.5 + 0.5; }

#define tw tw(1.0)

float rnd1 = 0.0;  // "random number"
vec3 ti = vec3(0.0);    // tile index whateva

//#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

const float sphereSize = 1.0;  // dont change that ;(

//const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

 // geometry  //
//  ======== //

float rectangle( vec2 p, vec2 size )
{
	float r = step( -size.x, p.x )  * step( -size.y, p.y ) *
		  step( p.x, size.x )   * step( p.y, size.y );
	return r;
}

float rectangleGUI( vec2 p1, vec2 size )
{
	float r = step( 0., p1.x )      * step( 0., p1.y ) *
		  step( p1.x, size.x )  * step( p1.y, size.y );
	return r;
}

float rectanglePoly( vec2 p, vec2 p2, vec2 size, vec2 difference )
{
	p = mod(p, (size + DIFFERENCE*tw));
	float r = step( -size.x, p.x ) * step( -size.y, p.y ) *
	          step( p.x, size.x )  * step( p.y, size.y );
	return r * rectangle( p2, SOMESMALLVALUE + size + DIFFERENCE*tw );
}

float circle( vec2 p, float radius )
{
	float o = step( length(p), radius );
	return o;
}

 // coloration  //
//  ========== //

vec3 hsv2rgb( vec3 c )
{
  vec4 K = vec4( 1.0, (2.0/3.0), (1.0/3.0), 3.0 );
  vec3 p = abs( fract( c.xxx + K.xyz )*6.0 - K.www );
  return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );
}

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    // from https://www.shadertoy.com/view/ll2GD3 palette shadertoy from iq:
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    return a + b*cos( TAU*( c*t + d ) );
}

vec3 dualPalette( float t, vec3 color1, vec3 color2 )
{
	vec3 c = vec3(1.0);
	c *= mix( color1, color2, t );
	return c * 1.0;
}

vec3 simplePalette( float t, vec3 r, vec3 g, vec3 b ) 
{
        vec3 c = vec3(
		   sin(TAU*(+r.x/+r.y)*t + r.z),
		   sin(TAU*(+g.x/+g.y)*t + g.z),
		   sin(TAU*(+b.x/+b.y)*t + b.z)
		);
	//c *= mix( color1, color2, t );
	return c;
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

 // the scene  //
//  ========= //

vec3 scene(vec2 p, vec2 p1)
{
	vec3 o = vec3(0.0);;
	#ifdef ROTATION
	p *= rot(time*ROTATION);
	#endif
	p -= 0.5*tw;
	vec2 rectSize = vec2(3.0, 3.0);
	vec2 difference = vec2(0.5, 0.5);
//	o += rectanglePoly( p, p, rectSize, difference ) * vec3(1.0);

	float yo, repeat = 6.0;
	p.x /= repeat;
	( p.x < 0.0 ) ?
		yo = mod(p.x + DIFFERENCE.x*tw/repeat, 2.0) :
	        yo = mod(p.x, 2.0);
	p.x *= repeat;
	o *= cosPalette( yo , PAL2 );
	p += 0.5*tw;
	
	return o;
}


/*vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}*/

float N31(vec3 p)
{
    vec3 a = fract(p/118899.99*vec3(1883.34,8889.34,37949.65));
    a+=dot(a,a+0.9);
    return fract((a.x*a.y*207.0214,a.y*a.z,a.z*a.x));
}

vec3 trans(vec3 p)
{
	float r = 3.0;
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

/* vec3 normal(vec3 p)
{
	float d = 0.01;
	return normalize(vec3(
		map(p + vec3(  d, 0.0, 0.0)) - map(p + vec3( -d, 0.0, 0.0)),
		map(p + vec3(0.0,   d, 0.0)) - map(p+ vec3(0.0,  -d, 0.0)),
		map(p + vec3(0.0, 0.0,   d)) - map(p + vec3(0.0, 0.0,  -d))
	));
} */


void main(void)
{
	vec3  camPos = vec3(0.05*time*299., sin(0.1*time)*144., 7.*sin(0.03*time)*833.);   // movement
	
	// fragment position
	vec2 p = 0.9*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 p0 = gl_FragCoord.xy/resolution.xy;   // need that for the backbuffer later
	vec2 p1 = gl_FragCoord.xy / resolution.xy; p1.y = 1.0 - p1.y;       // not centered top to bottom for UI stuff
	
	// ray
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
	ray.xz *= rot(0.033*time);
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
	o *= 6.0;
	// adding the rainbow color for the rainbow starrs
	//if   (mod(rnd1, 0.99) < (STAR_DENSITY*(1./RAINBOWSTAR_RATIO))/ 1000.) 
	//{ o = hsv2rgb(vec3(1.3*time+rnd1*14223.13, 0.99, 0.95)) - fog; o *= 3.0; }
	
	// adding the thing
	mat2 rotMatrix_1 = rot(0.2*time);
	p -= vec2(0.0, 0.0);
	p *= rotMatrix_1;
	float zoom = (1.-cos(time)*0.5+0.5)*0.36;
	if ( mod(time, 2.*TAU) < TAU) zoom = 1.0*0.36;
	
	//vec2 p3 = mod(((p*0.5*mix(0.01, 3.00, zoom))-vec2(1.15,0.4))*4.0, 3.0)-1.5;
        vec2 p3 = mod(((p-vec2(2.3,0.70)*0.5*mix(0.01, 3.00, zoom)))*4.0, 3.0)-1.5;
	
	//p3 -= 1.0;
	vec3 c = scene(p3 * 6.0, p1);
	//p3 += 1.0;
	if (c == vec3(0.0)) c += o;
	p *= rotMatrix_1;
	c += colorBar(p1, c);
	
	// adding the TAIL effect
	//c += 0.1*c + ((0.050*0.01)+0.2)*texture2D(bb, p0).xyz;   // just some backbuffer shyt
	gl_FragColor = vec4(c, 1.0);
}
