#extension GL_OES_standard_derivatives : enable
// BEGIN: shadertoy porting template
// https://gam0022.net/blog/2019/03/04/porting-from-shadertoy-to-glslsandbox/
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    gl_FragColor = col;
}
// END: shadertoy porting template

// Star Nest by Pablo RomÃ¡n Andrioli

// This content is under the MIT License.


#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.0010 

#define brightness 0.0055
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

#define mo (2.0 * iMouse.xy - iResolution.xy) / iResolution.y
#define blackholeCenter vec3(time*2., time, -2.)
#define blackholeRadius 1.0
#define blackholeIntensity 0.33

float iSphere(vec3 ray, vec3 dir, vec3 center, float radius)
{
	vec3 rc = ray-center;
	float c = dot(rc, rc) - (radius*radius);
	float b = dot(dir, rc);
	float d = b*b - c;
	float t = -b - sqrt(abs(d));
	float st = step(0.0, min(t,d));
	return mix(-1.0, t, st);
}

vec3 iPlane(vec3 ro, vec3 rd, vec3 po, vec3 pd){
    float d = dot(po - ro, pd) / dot(rd, pd);
    return d * rd + ro;
}

vec3 r(vec3 v, vec2 r)//incomplete but ultrafast rotation fcn thnx to rodolphito
{
    vec4 t = sin(vec4(r, r + 1.5707963268));
    float g = dot(v.yz, t.yw);
    return vec3(v.x * t.z - g * t.x,
                v.y * t.w - v.z * t.y,
                v.x * t.x + g * t.z);
}

void background(out vec4 fragColor, in vec2 fragCoord)
{
	//get coords and direction
	vec2 uv=fragCoord.xy/iResolution.xy-.525;
	uv.y*=iResolution.y/iResolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	float time=iTime*speed+.25;

	//mouse rotation
	vec3 from=vec3(0.0, 0.0, (-15.0 + time * 0.01));
    	dir = r(dir, mo / 90.0);
	from+=blackholeCenter;
	
    	vec3 nml = normalize(blackholeCenter - from);
    	vec3 pos = iPlane(from, dir, blackholeCenter, nml);
    	pos = blackholeCenter - pos;
	vec3 v = vec3(0.);
    	float intensity = dot(pos, pos);
	if (intensity > blackholeRadius * blackholeRadius * 0.5){
        	intensity = .3/ intensity;
    		dir = mix(dir, pos * sqrt(intensity), intensity);
    	
			//volumetric rendering
		float s=0.1,fade=1.;
		v=vec3(0.);
		for (int r=0; r<volsteps; r++) {
			vec3 p=from+s*dir*.5;
			p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
			float pa,a=pa=0.;
			for (int i=0; i<iterations; i++) { 
				p=abs(p)/dot(p,p)-formuparam; // the magic formula
				a+=abs(length(p)-pa); // absolute sum of average change
				pa=length(p);
			}
			float dm=max(0.,darkmatter-a*a*.001); //dark matter
			a*=a*a; // add contrast
			if (r>6) fade*=1.-dm; // dark matter, don't render near
			//v+=vec3(dm,dm*.5,0.);
			v+=fade;
			v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade*(dot(pos, pos)*.1); // coloring based on distance
			fade*=distfading; // distance fading
			s+=stepsize;
		}
		v=mix(vec3(length(v)),v,saturation); //color adjust
	}

		//fragColor = mix(vec4(v*.01,1.), fragColor, fragColor.a);
		//fragColor = vec4(v*.01*  fragColor.a,1.);
		fragColor = mix(vec4(v*.02,1.), vec4(v*.01,0.5), 1.-fragColor.a);

		//}
    //else fragColor = vec4(0.0);
}

// New #################################################################
#define iTime time
#define iResolution2 vec3(resolution,20.)
void effect(out vec4 O, vec2 I)
{
    vec3 p=iResolution2,d = -.5*vec3(I+I-p.xy,p)/p.x,c = d-d, i=c;
    for(int x=0;x<50;++x) {
        if (i.x>=1.) break;
        p = c,
        p.z -= iTime+(i.x+=.01),
        p.xy *= mat2(sin((p.z*=0.5)+vec4(0,11,33,0)));
        c += length(sin(p.yx)+cos(p.xz+iTime))*d;
    }
    O = (vec4(15
	     ,0,1,1)/length(c)) * 10.0;
}

// Windows ###################################################################
 // pre-processor makros  //
//  ==================== //

#define TAU                  6.283185307179586
#define rot(a)               mat2( cos(TAU*a), -sin(TAU*a), sin(TAU*a), cos(TAU*a) )
// tw = timewave (is normalized between 0. and 1.)
#define tw(a)                sin(a*time)*0.5 + 0.5

 // program options  //
//  =============== //

#define SPEED                3.0
#define ZOOM                 0.25
#define GAMMA_CORRECTION   2.2
#define TIMEWAVE             1.0
#define ROTATION	     0.1

 // pre-definitions  //
//  =============== //

#define time                 time*SPEED
float tw = tw(TIMEWAVE);  // defining tw as timewave with length of the constant TIMEWAVE
float tw2 = tw(0.1);

 // geometry  //
//  ======== //

float rectangle( vec2 p, vec2 size )
{
	float r = step( -size.x, p.x)  * step( -size.y, p.y ) *
		  step( p.x, size.x )   * step( p.y, size.y );
	return r;
}


vec3 rectanglePoly( vec2 p, vec2 p2, vec2 size, vec2 difference )
{
	p = mod(p, (size + tw2));
	
	vec3 color = floor(p.y-fract(dot(gl_FragCoord.xy, vec2(0.4, 0.8))) * 10.0) * 0.05 * vec3(1.) - 0.0001;  //
	
	
	float mid_x = abs(p.x - p2.x)/2.;
	float mid_y = abs(p.y - p2.y)/2.;
	
	if (abs(p.x-p2.x)>mid_x) {
		color += vec3(0.0, 1.0, 0);
	}
	if (abs(p.y-p2.y)>mid_y) {
		color += vec3(1.0, 0.0, 0);
	}
	if (abs(p.x-p2.x)<=mid_x && abs(p.y-p2.y)<=mid_y) color.b += 1.0;
	
	
	float r = step( p.y, size.y  ) * step( p.x, size.x );
	//float r = step( -size.x, p.x ) * step( -size.y, p.y ) *
	 //         step( p.x, size.x )  * step( p.y, size.y  );

	
	return color * r * rectangle( p2, size  + tw2 );
}


 // the scene  //
//  ========= //

vec3 scene(vec2 p, vec2 p1)
{
	vec3 o = vec3(0.0);
	#ifdef ROTATION
	p *= rot(time*ROTATION*0.025);
	p -= tw2*0.5;
	#endif
	vec2 rectSize = vec2(3.0, 3.0);
	vec2 difference = vec2(4.0, 4.0);
	o += rectanglePoly( p, p, rectSize, difference );
	
	return o;
}

 // the program  //
//  =========== //

void Symbol( out vec4 fragColor)
{
	// fragment
	vec2 p  = 1./0.09 * (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);  // centered
	//p = p + vec2(blackholeCenter.x, blackholeCenter.y)/resolution*0.5;
	vec2 p0 = gl_FragCoord.xy / resolution.xy;                                                   // not centered for backbuffer
	vec2 p1 = gl_FragCoord.xy / resolution.xy; 
	p1.y = 1.0 - p1.y;             // not centered top to bottom for UI stuff
	vec3 c = vec3(0.0, 0.0, 0.0);  // color variable for each fragment with alpha channel
        
	//p -= vec2(mouse.x*5.-1., mouse.y*5.-1.);
	//p *= 3.*(1.-((1.-tw)+1.5));
        // the scene
        c += scene(p, p1);
	c = pow(c.rgb, vec3(1.0/GAMMA_CORRECTION));
	// the final fragment
	if (c.r == 0.) return;
	fragColor = vec4(c, 1.0);
}



void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	effect(fragColor, fragCoord);
	background(fragColor, fragCoord);
	Symbol(fragColor);
	
}