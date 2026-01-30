#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

// ---------------------------------------------------------------------------

#define iTime time
#define iResolution resolution

// https://www.shadertoy.com/view/3lj3DW
// The MIT License
// Copyright © 2019 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Analytic intersection of a Goursat surface (degree 4 equation). I think I
// still have a bug...


// Other intersectors: http://iquilezles.org/www/articles/intersectors/intersectors.htm
//
// Box:             https://www.shadertoy.com/view/ld23DV
// Triangle:        https://www.shadertoy.com/view/MlGcDz
// Capsule:         https://www.shadertoy.com/view/Xt3SzX
// Ellipsoid:       https://www.shadertoy.com/view/MlsSzn
// Sphere:          https://www.shadertoy.com/view/4d2XWV
// Capped Cylinder: https://www.shadertoy.com/view/4lcSRn
// Disk:            https://www.shadertoy.com/view/lsfGDB
// Torus:           https://www.shadertoy.com/view/4sBGDy
// Capped Cone:     https://www.shadertoy.com/view/llcfRf
// Rounded Cone:    https://www.shadertoy.com/view/MlKfzm
// Sphere4:         https://www.shadertoy.com/view/3tj3DW
// Goursat:         https://www.shadertoy.com/view/3lj3DW

float cuberoot( float x ) { return sign(x)*pow(abs(x),1.0/3.0); }

// hole: x4 + y4 + z4 - (r2^2)·(x2 + y2 + z2) + r1^4 = 0;
float iHole4( in vec3 ro, in vec3 rd, in float ra, float rb )
{
    float ra2 = ra*ra;
    float rb2 = rb*rb;
    
    vec3 rd2 = rd*rd; vec3 rd3 = rd2*rd;
    vec3 ro2 = ro*ro; vec3 ro3 = ro2*ro;

    float ka = 1.0/dot(rd2,rd2);

    float k3 = ka*(dot(ro ,rd3));
    float k2 = ka*(dot(ro2,rd2) - rb2/6.0);
    float k1 = ka*(dot(ro3,rd ) - rb2*dot(rd,ro)/2.0  );
    float k0 = ka*(dot(ro2,ro2) + ra2*ra2 - rb2*dot(ro,ro) );

    float c2 = k2 - k3*(k3);
    float c1 = k1 + k3*(2.0*k3*k3-3.0*k2);
    float c0 = k0 + k3*(k3*(c2+k2)*3.0-4.0*k1);

    c0 /= 3.0;

    float Q = c2*c2 + c0;
    float R = c2*c2*c2 - 3.0*c0*c2 + c1*c1;
    float h = R*R - Q*Q*Q;
    
    
    // 2 intersections
    if( h>0.0 )
    {
        h = sqrt(h);

        float s = cuberoot( R + h );
        float u = cuberoot( R - h );
        
        float x = s+u+4.0*c2;
        float y = s-u;
        
        float k2 = x*x + y*y*3.0;
  
        float k = sqrt(k2);

		return -0.5*abs(y)*sqrt(6.0/(k+x)) 
               -2.0*c1*(k+x)/(k2+x*k) 
               -k3;
    }
	
	// 4 intersections
    float sQ = sqrt(Q);
    float z = c2 - 2.0*sQ*cos( acos(-R/(sQ*Q)) / 3.0 );

    float d1 = z   - 3.0*c2;
    float d2 = z*z - 3.0*c0;

    if( abs(d1)<1.0e-4 )
    {
        
        if( d2<0.0 ) return -1.0;
        d2 = sqrt(d2);
    }
    else
    {
        if( d1<0.0 ) return -1.0;
        d1 = sqrt( d1/2.0 );
        d2 = c1/d1;
    }

    //----------------------------------

    float h1 = sqrt(d1*d1 - z + d2);
    float h2 = sqrt(d1*d1 - z - d2);
    float t1 = -d1 - h1 - k3;
    float t2 = -d1 + h1 - k3;
    float t3 =  d1 - h2 - k3;
    float t4 =  d1 + h2 - k3;

    if( t2<0.0 && t4<0.0 ) return -1.0;

    float result = 1e20;
         if( t1>0.0 ) result=t1;
    else if( t2>0.0 ) result=t2;
         if( t3>0.0 ) result=min(result,t3);
    else if( t4>0.0 ) result=min(result,t4);

    return result;
}

vec3 nSphere4( in vec3 pos, float ra, float rb )
{
    return normalize( 4.0*pos*pos*pos - 2.0*pos*rb*rb );
}

#define AA 2

#define ZERO min(iFrame,0)

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // camera movement	
	float an = 0.5*iTime;
	vec3 ro = vec3( 3.2*cos(an), 1.5, 3.2*sin(an) );
    vec3 ta = vec3( 0.0, -0.05, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    
    vec3 tot = vec3(0.0);
    
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
        #else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
        #endif

	    // create view ray
	    vec3 rd = normalize( p.x*uu + p.y*vv + 2.0*ww );

        // raytrace
	
	    // raytrace-plane
        float ra = 0.8;// + 0.1*sin(1.0*iTime+0.0);
        float rb = 1.0;// + 0.1*sin(2.3*iTime+1.0);
	    float t = iHole4( ro, rd, ra, rb );

        // shading/lighting	
	    vec3 col = vec3(0.08)*(1.0-0.3*length(p));
        
	    if( t>0.0 )
	    {
            vec3 pos = ro + t*rd;
		    vec3 nor = nSphere4( pos, ra, rb );
		    float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
		    float amb = clamp( 0.5 + 0.5*nor.y, 0.0, 1.0 );
            
            //const float fr = 32.70;
            const float fr = 20.5;
            col = vec3(0.6);
            col += 0.4*smoothstep(-0.01,0.01,cos(pos.x*fr*0.5)*cos(pos.y*fr*0.5)*cos(pos.z*fr*0.5)); 
            col *= 1.0*smoothstep(-1.0,-0.98,cos(pos.x*fr))
                      *smoothstep(-1.0,-0.98,cos(pos.y*fr))
                      *smoothstep(-1.0,-0.98,cos(pos.z*fr));
            
            //col += 0.4*smoothstep(-0.01,0.01,sin(pos.x*50.0)); 

		    col *= vec3(0.2,0.3,0.4)*amb + vec3(1.0,0.9,0.7)*dif;
	    }
	
        col = sqrt( col );

	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	// dither to remove banding in the background
    tot += fract(sin(fragCoord.x*vec3(13,1,11)+fragCoord.y*vec3(1,7,5))*158.391832)/255.0;

    
    fragColor = vec4( tot, 1.0 );
}

// ---------------------------------------------------------------------------

void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy );

}