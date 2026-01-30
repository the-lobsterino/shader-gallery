/*
 * Original shader from: https://www.shadertoy.com/view/MtGfWK
 *
 * added: zoom and dynamic water level
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// --------[ Original ShaderToy begins here ]---------- //
// Author: ocb

/*****************************************************************************/
/* dFdx Terrain Gen
/* First try to use dFdx() and fwidth()
/* dFdx/dFdy is used to find local normal on a value noise.
/* fwidth() is used as an indicator of slope (ex. to avoid forest or snow on steep slope
/*****************************************************************************/

#define R resolution
#define STEP 8.

float H2(in vec2 st) 
{ return fract(sin(dot(st,vec2(12.9898,8.233))) * 43758.5453123); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 mpos = 2.0+3.0*mouse.xy;
    vec2 uv = (mpos.y*fragCoord-R.xy)/R.y;
    vec2 scroll = uv;	
    float vSpeed = (time+444.)*.1;
    scroll.y += vSpeed;              // vertical scrolling
    
    float h = 0., hsea = 0.;
    vec3 col = vec3(.5);
    vec3 lit = normalize(vec3(.5,.1,1.)); // light direction
    
    float a = 1., Hz = 1., m = 1.;	// fbm
    vec2 d = vec2(1.,0.);
    for(float i=1.;i<=STEP; i++)
    {   vec2 e = floor(scroll*Hz), f = fract(scroll*Hz);
        f = smoothstep(0.,1.,f);
        h += mix( mix(H2(e),H2(e+d.xy),f.x)*a,
            	  mix(H2(e+d.yx),H2(e+d.xx),f.x)*a,
            	  f.y);
        
        a *= 0.9*(.26 +.1*h +.015*i);
        Hz *= 2.;
        m += a;
        hsea += .2*h;	// kind of integrated h to smooth the sea bottom
    }
    h = h/m-.5;

    float water_level = 0.003*(.5+cos(time*5.+1.4*dot(uv,uv)));    // dyn. water level
    float below = step(h,water_level), above = 1.-below;           // above and below sea level
    float fwdh = 0.5*R.x*fwidth(h);    // fwidth is used to reduce or avoid snow or trees on steep slope

    col.b += .9*below;				     // sea water
    col.g += .6*smoothstep(.4,.8,hsea)*below;
    col += vec3(smoothstep(.2,.4-.02*fwdh,h));	// snow
    col -= vec3(.3-h,.25,.35)*(1.-smoothstep(.1,.2,h))*above*(1.-smoothstep(1.,6.,(h*h+.9)*fwdh));	// forest

    float dx= R.x*dFdx(h)*above + R.x*dFdx(hsea)*below;			// derivatives
    float dy= R.y*dFdy(h)*above + R.y*dFdy(hsea)*below;
    vec3 n = normalize(cross(vec3(1.,dx,0.),vec3(0.,dy,1.)));		// local normal
    float shad = (.6+.5*dot(n,-lit));					// shadowing
    col *= shad*smoothstep(-.4,-.0,h)*(.2+.8*above);
	
    col += vec3(.2,.1,.0)*(shad-.5)*above;				// warmer the light on the sunny side 
   col += .016*(abs(dx)+abs(dy))*fwdh*below*smoothstep(-.04,0.,h-1.5*water_level)*shad;	// wave foam along coast
    
    fragColor = vec4(1.7*col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //
void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }