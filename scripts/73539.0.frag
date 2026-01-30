// Modified so it doesn't really move. Very childish and easy fix.
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float Pi = 3.14159;
uniform vec2 mouse;

const int   complexity      = 2;    // More points of color.
const float fluid_speed     = 4.0;  // Drives speed, higher number will make it slower.
//const float color_intensity = 0.8;

vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float level=1.;
float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);
    float t = pow(2.,level)* .4*time;
    mat2 R = mat2(cos(t),-sin(t),sin(t),cos(t));
    if (mod(i.x+i.y,2.)==0.) R=-R;

    return 2.*mix( mix( dot( hash( i + vec2(0,0) ), (f - vec2(0,0))*R ), 
                     dot( hash( i + vec2(1,0) ),-(f - vec2(1,0))*R ), u.x),
                mix( dot( hash( i + vec2(0,1) ),-(f - vec2(0,1))*R ), 
                     dot( hash( i + vec2(1,1) ), (f - vec2(1,1))*R ), u.x), u.y);
}

float Mnoise(in vec2 uv ) {
  //return noise(uv);                      // base turbulence
  //return -1. + 2.* (1.-abs(noise(uv)));  // flame like
    return -1. + 2.* (abs(noise(uv)));     // cloud like
}

float turb( in vec2 uv )
{ 	float f = 0.0;
	
 level=1.;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    f  = 0.5000*Mnoise( uv ); uv = m*uv; level++;
	f += 0.2500*Mnoise( uv ); uv = m*uv; level++;
	f += 0.1250*Mnoise( uv ); uv = m*uv; level++;
	f += 0.0625*Mnoise( uv ); uv = m*uv; level++;
	return f/.9375; 
}

void main()
{
  vec3 col = vec3(0.0);
  vec3 colorIn  = vec3(0.643,0.058,0.090);
  vec3 colorOut = vec3(0.985,0.783,0.965);
  vec2 p=gl_FragCoord.xy/resolution.xy;
  vec2 pos = gl_FragCoord.xy/resolution.xy;
  for(int i=1;i<complexity;i++)
  {
    vec2 newp=p + time*0.001;
    newp.x+=0.8/float(i)*sin(float(i)*p.y+time/fluid_speed+0.3*float(i)) + 0.5;
    newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5;
    p=newp;
  }
  float pct = sin(1.6 * p.x) * sin(1.6 * p.y);
  col = mix(colorIn, colorOut, pct);
  //vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);
  //col = mix(colorIn, colorOut, sin(p.x));
  //gl_FragColor=vec4(col, 1.0);
	
  //float n = noise(vec2(pos * 5.0));
  float n = Mnoise(vec2(pos * 5.0));
	
  //f = Mnoise( 5.*uv );
  //f = turb( 5.*uv );
	
  col = mix(col, vec3(n), 0.1);
	
  gl_FragColor= vec4(col, 1.0);
  
}
