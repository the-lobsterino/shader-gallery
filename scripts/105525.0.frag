// chatGPT ,this fuck

// chatGPT , make this hunk more sexy
// chatGPT , add cock
// chatGPT , add some scrolling lines behind the bitch
// chatGPT , change the colors bruh
// chatGPT , bitch needs to be.
// FATBITCH


#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float tanh(float val)
{
    float tmp = exp(val);
    float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);
    return tanH;
}

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4  iMouse = vec4(0.0);

// original - https://www.shadertoy.com/view/3ty3Dd
#define AA 2

float pi = 3.14159265, tau = 6.2831853;

float box (in float x, in float x1, in float x2, in float a, in float b) {
	return tanh(a * (x - x1)) + tanh(-b * (x - x2));
}
float sdSphere( vec3 p, float s )
{
    return length(p)-s;
}
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float ex (in float z, in float z0, in float s) {
    return exp(-(z - z0) * (z - z0) / s);
}

float r(in float z, in float x) {
    float s = sin (tau * x), c = cos(tau * x),
		c2 = cos (pi * x), t4z = tanh(4. * z);
    return /* body */.4 * (1.0 - .4 * ex(z, .8, .15) +
		s * s + .6 * ex(z, .8, .25) * c * c + .3 * c) *
		0.5 * (1. + t4z) + /* legs */ (1. - .2 * ex(z, -1.3, .9)) *
		0.5 * (1. - t4z) * (.5 * (1. + s * s + .3 * c) *
		(pow(abs(s), 1.3) + .08 * (1. + t4z) ) ) +
		/* improve butt */ .25 * box(c2, -.45, .45, 5., 5.) *
		box(z, -.5, .2, 4., 2.) - 0.1 * box(c2, -.008, .008, 30., 30.) *
		box(z, -.4, .25, 8., 6.) - .05 * pow(abs(sin(pi * x)), 16.) * box(z, -.55, -.35, 8., 18.);
}

// $1M question: how close are we to ParametricPlot3D[...] surface?
float sd( in vec3 p )
{
	/* shift butt belly */
	float dx = .1 * exp(-pow((p.z-.8),2.)/.5) - .20 * exp(-pow((p.z -.1),2.)/.5);

    // on the surface, we have:
    // p.x = r * cos + dx
	// p.y = r * sin
	
    float jiggle = p.z*2.00;
    float jsize = 1.5;
    if (iMouse.z>1.5)
    {
        jiggle+=p.y*.5;
        jsize+=.200;
    }
    
	dx *= 1.5+(sin(jiggle+iTime*9.65)*jsize);
	
	float angle = atan(p.y, p.x - dx);
	float r_expected = r(p.z, angle / tau);
//	float d1 = (.5 + .5 * smoothstep(.4,1.,p.z)) * (length(vec2(p.y, p.x - dx)) - r_expected);
	float d1 = (length(vec2(p.y, p.x - dx)) - r_expected)*0.5;
	
	float d4 = sdSphere(p+vec3(-0.35,0.0,-0.8),0.65);
	d1 = smin(d1,d4,0.4);
	
	
    
	p.x -= dx;
	p.y = abs(p.y);
	float d2 = sdSphere(p+vec3(-0.35,-0.4,-1.875),0.525);
	float d3 = sdSphere(p+vec3(-0.85,-0.4,-1.875),0.08);
	
    d2 = smin(d2,d3,0.0325);
    return smin(d1,d2,0.07);
    //return min(d1,min(d2,d3));
}


float map( in vec3 pos )
{
    return sd (pos.zxy);
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.001;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     // camera movement	
	float an = sin(iTime+2.15)*0.7;	//0.5*iTime - 0.8;
    // if (iMouse.z>0.5)
        an+=iMouse.x/(iResolution.x*0.25);
    //an+=3.14;
    
	vec3 ro = vec3( 2.55*sin(an), 0.5, 2.55*cos(an) );
    vec3 ta = vec3( 0.0, .8, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    vec3 tot = vec3(0.0);
    
    
    vec2 p1 = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
    float val = sin(iTime+p1.x+p1.y*20.0)*(0.8+sin(p1.y*p1.x*2.5+iTime*3.0)*0.3);
    val = clamp(val+0.275,0.0,2.0);
	val = pow(abs(val-0.15),5.0);
    vec3 bcol = vec3(val*(0.5+sin(p1.x*3.0+time)*0.3),val*1.1,val*0.5);
	bcol.rgb = bcol.brg;
    
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
        
        vec3 col = bcol;
        // raymarch
        if (abs(p.x)<0.8)
        {
            // create view ray
            vec3 rd = normalize( p.x*uu + p.y*vv + 1.8*ww );
            
            const float tmax = 5.0;
            float t = 0.0;
            for( int i=0; i<150; i++ )
            {
                vec3 pos = ro + t*rd;
                float h = map(pos);
                if( h<0.0001 || t>tmax ) break;
                t += h;
            }
            // shading/lighting	
            if( t<tmax )
            {
                vec3 pos = ro + t*rd;
                vec3 nor = calcNormal(pos);
                float dif = clamp( dot(nor,vec3(0.7,0.6,0.4)), 0.0, 1.0 );
                float amb = 0.5 + 0.5*dot(nor,vec3(0.0,0.8,0.6));
                col = vec3(0.3,0.15,0.1)*amb + vec3(0.8,0.5,0.2)*dif;
		    col += pow(dif,16.0);
            }
        }

        // gamma        
        //col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif
    // gamma        
    tot = sqrt( tot );
	fragColor = vec4( tot, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0.0, 0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

