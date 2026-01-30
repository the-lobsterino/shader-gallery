/*
 * Original shader from: https://www.shadertoy.com/view/ttK3DK
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
  // This shader is purely a learning exercise for me, so I threw too much into it and got a horrible framerate as a result.
  // Several resources were used/studied/shamelessly pinched, including:
  // Inigo Quillez youtube page: https://www.youtube.com/channel/UCdmAhiG8HQDlz8uyekw4ENw
  // The Art of Code https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg
  //
  // nb. I'm not a coder and this is my first attempt. Don't expect to learn anything from this mess.
  //
  // Originally written in HLSL/CG in Unity and converted to Shadertoy.
  //
  // I made a version with AA, it was painfully slow on my PC.
    
    #define MAX_STEPS 100.0
    #define MAX_DIST 40.0
    #define SURF_DIST .01
    #define lightDir normalize(vec3(-.5, 2, -1))

float mmod(float x, float y) {
	return (fract(x/y-.5)-.5)*y;
}

//White noise.
float whiteNoise(vec3 p) {
    float n = fract( sin ((p.x-2.0)*p.y*p.z*100.)*55647.);
    return n;  
}

// Perlin Noise Octave
float perlinNoiseOctave3D(vec3 p, float o, float s) { //Position p,Number of octave o, Octave scale s
	vec3 lv = smoothstep(0.0,1.0,fract(p*o*s));
	vec3 id = floor(p*o*s);
	float bl = whiteNoise(id);
	float br = whiteNoise(id+vec3(1,0,0));
	float b = mix(bl, br, lv.x);
	float tl = whiteNoise(id+vec3(0,1,0));
	float tr = whiteNoise(id+vec3(1,1,0));
	float t = mix(tl, tr, lv.x);
	float f1 = mix(b, t, lv.y);
	float bl2 = whiteNoise(id+vec3(0,0,1));
	float br2 = whiteNoise(id+vec3(1,0,1));
	float b2 = mix(bl2, br2, lv.x);
	float tl2 = whiteNoise(id+vec3(0,1,1));
	float tr2 = whiteNoise(id+vec3(1,1,1));
	float t2 = mix(tl2, tr2, lv.x);
	float f2 = mix(b2, t2, lv.y);
    return mix(f1, f2, lv.z);  
}

// Perlin Noise 3D
float perlinNoise3D(vec3 p) {
	p.z=mmod(p.z,8.0);
	p.y+=1.0; // hide 0 values beneath the water
	float c=0.0;
	    for (float i=1.0; i<5.0; i+=2.0) {
		c+= perlinNoiseOctave3D( p, pow( 2.0 , i-1.0 ), 40.0/i)/i;
		};
    return c;
}

//Brick
float TextureBrick( vec3 p, float s ) { //Position, scale.
   p *=12.0;
   p.z = mmod(p.z,64.0);
   p.x+=(p.y+p.z)*.03*(sin(p.x*.1)+1.1); // Randomize bricks
   p.z+=(p.y+p.x)*.05*(cos(p.x*.1)+1.1);
   float v = smoothstep(sin (s*2.0*p.y)-.98,0.1,0.0); //Vertical cement
   float o = ceil(sin(s*p.y+2.2))*3.141; //Brick Offset
   float h = smoothstep(sin (s*p.x+o)-0.99,0.1,0.0);
   float d = smoothstep(sin (s*p.z+o+2.2)-0.99,0.1,0.0);
   return 1.0-(min(min(v,h),d)*clamp(p.y*-.1+1.0,0.0,1.0));
}

// 2D (infinite length) Cylinder in y plane
float fCylinder(vec3 p, float r) {
	float d = length(p.xz) - r;
	d = max(d, abs(p.y));
	return d;
}

//Archway
float sdArchway( vec2 rep, vec3 p, vec3 b, float r, float t, vec2 f, vec2 m, vec2 apos, float aradius, float aheight ) {
    b-=r; //prevent scaling due to erosion.
    p.x = mmod(p.x,rep.x);
    p.z = mmod(p.z,rep.y);
	b.z +=clamp((-p.y+t),0.0,m.y)*f.y; //flare
	b.x +=clamp((-p.y+t),0.0,m.x)*f.x;
  vec3 q = abs(p) -b;
  float structure = length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
  vec2 dc = abs(p.xy-apos+vec2(0,aradius*aheight)) -vec2(aradius,aradius*aheight);   // arch  
  float darch = length(max(dc,0.0)) + min(max(dc.x,dc.y),0.0) ;
  darch = min(darch,length(p.xy-apos) - aradius); 
  return max(structure,-darch);
}


//A box with a taper.
float sdCubeTaper( vec2 rep, vec3 p, vec3 b, float r, float t, vec2 f, vec2 m ) { // Position, Size, Roundness, max tapering height, tapering factor, max tapering size
    b-=r; //prevent scaling due to erosion.
    p.x = mmod(p.x,rep.x);
    p.z = mmod(p.z,rep.y);
	b.z +=clamp((-p.y+t),0.0,m.y)*f.y;
	b.x +=clamp((-p.y+t),0.0,m.x)*f.x;
  vec3 q = abs(p) -b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r ;
}

// 3D Cylinder in z plane with details. Position, radius, roundness (bevel), height (z height)
float sdCylinderz(vec3 p, float pivot, float rad, float r, float h) {
	rad-=r; //prevent scaling due to erosion.
    p.y+=pivot;
	float d = length(p.xy) - rad;
	d = max(d, abs(p.z+clamp(sin(d*100.0)*.01,-1.0,0.0))- h);
	return d;
}

// 3D Cylinder in y plane. Position, pivot, radius, roundness (bevel), height (z height)
float sdCylindery(vec3 p, float pivot, float rad, float r, float h) {
	rad-=r; //prevent scaling due to erosion.
    p.y+=pivot;
	float d = length(p.xz) - rad;
	d = max(d, abs(p.y)- h);
	return d;
}

//  Rotation matrix, Z axis
mat4 ZRot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat4(
        vec4(c, -s, 0.0, 0.0),
        vec4(s, c, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

// Animated pendulum
float Pendulum(vec3 p) {
    vec3 pos = (ZRot(cos(-iTime))*vec4((p-vec3(4.0,1.19,-3.25)),1.0)).xyz;
	float d = sdCylinderz(pos, 0.60, 0.12, .02, 0.05);
    float d1 = sdCylindery(pos, 0.35, 0.02, .02, 0.4);
	d = min(d1, d);
	return d;
}


float WaterDist(vec3 p) {
    p*=vec3(12,1,12);
    float w1 = iTime*1.2+p.x+cos(p.z);
	float w2 = (iTime*1.2+p.z-p.x)*0.365;
	float l = sin(iTime*3.0+p.x)*0.5+0.5;
	return p.y+(.024*mix(abs(sin(w1)),abs(cos(w1)),l)+mix(abs(sin(w2)),abs(cos(w2)),l)*0.01)*.6;
}

//....Map...............................................................................................................//
vec3 Map(vec3 p,bool detail, bool geodetail) { // distance, displacement detail, geometry detail
    vec4 s = vec4 (cos(iTime)*2., 2.2, sin(iTime)*2.+0.0, 1.0);
    vec4 s2 = vec4 (2.0, 20.0, 10.0, 3.0);
	float perlinNoiseSample=0.0;
	if (detail) { perlinNoiseSample = perlinNoise3D(p);}
	float d = MAX_DIST;
	float br = perlinNoiseSample*0.02; //erosion
	float col = 10.0; //Colour mask
	float notwaterdist = 0.0; // Distance from water surface to the nearest not-water object.
	
	vec2 rep1 = vec2(8.0,16.0); //Object Repetition mod Values
	vec2 rep2 = vec2(8.0,32.0);
	vec2 rep3 = vec2(0.5,32.0);
	vec2 rep4 = vec2(0.25,32.0);
	vec2 rep5 = vec2(20.0,8.0);
	
	float d1 = sdCubeTaper(rep1, p-vec3(1.0,0.5,1.5) , vec3(0.375,1.3,0.20) , br, 0.2 ,vec2(0.1,0.2), vec2(0.46,0.46));
    d = d1; //Building 1, Main
    d1 = sdCubeTaper(rep1, p-vec3(.68,0.5,1.8) , vec3(0.1,1.6,0.10) , br, 0.7 ,vec2(0.5,0.5), vec2(0.2,0.2));
    d = min(d1, d); 	//Tall back tower


	d1 = sdCubeTaper(rep1, p-vec3(3.45,0.5,1.5) , vec3(0.18,2.0,0.30) , br, 0.5 ,vec2(0.08,0.4), vec2(1.0,1.1));
    d = min(d1, d); //Building 2
	d1 = sdCubeTaper(rep1, p-vec3(4.15,0.5,1.5) , vec3(0.18,2.0,0.30) , br, 0.5 ,vec2(0.08,0.4), vec2(1.0,1.1));
    d = min(d1, d); //Sides
	d1 = sdCubeTaper(rep1, p-vec3(3.8,0.4,1.5) , vec3(0.3,2.0,0.14) , br, 0.0 ,vec2(0.02,0.2), vec2(0.2,1.1));
    d = min(d1, d); //Back

	d1 = sdArchway(rep1, p-vec3(1.5,0.3,11.5) , vec3(0.475,0.5,0.20) , br, 0.4 ,vec2(0.1,0.2), vec2(2.0,0.0), vec2(0.0,-0.1), 0.17, 2.0);
    d = min(d1, d); //Building 3
	d1 = sdCubeTaper(rep1, p-vec3(1.16,1.2,11.5) , vec3(0.14,0.7,0.20) , br, 0.4 ,vec2(0.1,0.2), vec2(0.0,0.0));
    d = min(d1, d);	
	
	d1 = sdArchway(rep2, p-vec3(2.3,0.0,+1.5) , vec3(0.3,1.0,0.20) , br, 1.0 ,vec2(8,0.2), vec2(0.1,0.0), vec2(0.0,0.0), 0.8, 1.5);
	d = min(d1, d); //Bridge
	
    d1 = sdCubeTaper(rep2, p-vec3(1.5,-.1,9.6) , vec3(0.3,0.12,2.45) , br, 0.0 ,vec2(0.0,0.0), vec2(0.0,0.0));
    d = min(d1, d); //Pier

	d1 = sdCubeTaper(rep2, p-vec3(1.1,0.3,6.5) , vec3(0.15,0.7,0.20) , br, 0.2 ,vec2(0.1,0.2), vec2(0.0,4.0));
    d = min(d1, d); //Pier end Building
	d1 = sdCubeTaper(rep2, p-vec3(1.9,0.3,6.5) , vec3(0.15,0.7,0.20) , br, 0.2 ,vec2(0.1,0.2), vec2(0.0,4.0));
    d = min(d1, d);
	d1 = sdArchway(rep2, p-vec3(1.5,0.3,6.5) , vec3(0.3,0.5,0.16) , br, 0.0 ,vec2(0.1,0.2), vec2(0.0,4.0), vec2(0.0,0.2), 0.15, 1.0);
    d = min(d1, d);

	d1 = sdArchway(rep3, p-vec3(-9.4,0.0,22.4) , vec3(0.16,0.4,0.20) , br, 0.5 ,vec2(1.0,0.0), vec2(2.0,0.0), vec2(0.0,0.1), 0.2, 2.0);
    d = min(d1, d); //Bridge
	
	d1 = sdArchway(rep5, p-vec3(4.0,0.6,-3.5) , vec3(0.300,0.7,0.07) , br, 0.6 ,vec2(0.1,0.2), vec2(0.0,0.0), vec2(0.0,0.45), 0.17, 1.8);
    d = min(d1, d); //Pendulum building
	d1 = sdArchway(rep5, p-vec3(4.0,0.6,-3.0) , vec3(0.300,0.7,0.07) , br, 0.6 ,vec2(0.1,0.2), vec2(0.0,0.0), vec2(0.0,0.45), 0.17, 1.8);
    d = min(d1, d);
	d1 = sdCubeTaper(rep5, p-vec3(4.0,0.0,-3.25) , vec3(0.3,0.3,0.3) , br, 0.2 ,vec2(0.2,0.2), vec2(0.46,0.46));
    d = min(d1, d);

	if (geodetail) {           //Building Small Geometry
    	d1 = sdCubeTaper(rep1, p-vec3(1.02,1.82,1.46) , vec3(0.34,0.025,0.18), br, 0.7 ,vec2(0.5,0.5), vec2(0.2,0.2));
        d = min(d1, d);
	    d1 = sdCubeTaper(rep1, p-vec3(.70,2.12,1.85) , vec3(0.04,0.025,0.1), br, 0.7 ,vec2(0.5,0.5), vec2(0.2,0.2));
        d = min(d1, d); 		//Big Roof
    	d1 = sdCubeTaper(rep2, p-vec3(1.5,-.1,6.5) , vec3(0.5,0.12,0.5) , br, 0.0 ,vec2(0.0,0.0), vec2(0.0,0.0));
        d = min(d1, d);     	//Pier Top
    	d1 = sdArchway(rep1, p-vec3(0.98,1.1,1.30) , vec3(0.190,0.7,0.05) , br, 0.0 ,vec2(0.0,0.0), vec2(0.0,0.0), vec2(0.0,-0.3), 0.13, 2.0);
        d = min(d1, d);
    	d1 = sdCubeTaper(rep1, p-vec3(0.98,0.95,1.28) , vec3(0.26,0.04,0.05) , br, 0.0 ,vec2(0.0,0.0), vec2(0.0,0.0));
        d = min(d1, d);     	//Lower Struts, building 1
        d1 = sdCubeTaper(rep1, p-vec3(1.28,0.5,1.65) , vec3(0.1,1.0,0.10) , br, 1.0 ,vec2(0.5,1.5), vec2(0.,.25));
        d = min(d1, d);        //roof, building 1
    	d1 = sdCubeTaper(rep1, p-vec3(3.8,0.4,1.5) , vec3(0.3,0.5,0.20) , br, 0.0 ,vec2(0.02,0.2), vec2(0.2,1.1));
        d = min(d1, d);
    	d1 = sdArchway(rep1, p-vec3(3.8,1.9,1.5) , vec3(0.475,0.5,0.20) , br, 0.0 ,vec2(0,0), vec2(0,0), vec2(0.0,-0.0), 0.2, 0.6);
        d = min(d1, d);
        d1 = sdCubeTaper(rep1, p-vec3(3.8,2.45,1.5) , vec3(0.3,0.04,0.20) , br, 0.0 ,vec2(0.0,0.0), vec2(0.0,0.0));
        d = min(d1, d);     	// Building 2, Middle Bottom to top
        d1 = sdCubeTaper(rep1, p-vec3(3.8,2.5,1.5) , vec3(0.5,0.04,0.3) , br, 0.1 ,vec2(0.5,0.5), vec2(1.0,1.0));
        d = min(d1, d);     	//Roof
    	d1 = sdCubeTaper(rep1, p-vec3(1.72,1.2,11.5) , vec3(0.26,0.8,0.20) , br, 0.4 ,vec2(0.1,0.2), vec2(0.0,0.0));
        d = min(d1, d);
    	d1 = sdCubeTaper(rep1, p-vec3(1.45,1.2,11.5) , vec3(0.2,0.5,0.16) , br, 0.4 ,vec2(0.1,0.2), vec2(0.0,0.0));
        d = min(d1, d);
    	d1 = sdArchway(rep1, p-vec3(1.54,1.1,11.4) , vec3(0.16,0.5,0.20) , br, -0.5 ,vec2(0.1,0.2), vec2(2.0,0.0), vec2(0.0,-0.18), 0.08, 1.5);
        d = min(d1, d);         //Building 3	
	    d1 = sdArchway(rep4, p-vec3(-9.4,0.45,22.4) , vec3(0.16,0.15,0.1) , br, 0.5 ,vec2(1.0,0.0), vec2(2.0,0.0), vec2(0.0,0.02), 0.1, 2.0);
        d = min(d1, d);     	// Bridge Top
    	d1 = sdCubeTaper(rep2, p-vec3(1.5,.88,6.5) , vec3(0.6,0.02,0.2) , br, 0.0 ,vec2(0.0,0.0), vec2(0.0,0.0));
        d = min(d1, d);     	// Pier end building roof
		d1=Pendulum(vec3(p.x,p.y,mmod(p.z,8.0)));
	    if (d1<d) {d = min(d1, d); col = 2.0;}
		d1 = WaterDist(p);
		if (d1<d) {notwaterdist = d; col = 3.0; d=d1;}
}

    if (d<MAX_DIST && col>9.5) {
	float text = ((TextureBrick(p+.05+perlinNoiseSample*.005,8.0)*0.004+.002)*perlinNoiseSample);
	col=clamp(p.y,0.0,1.0)*.004+text*.2;
	d+=clamp(1.0-p.y,0.1,1.0)*text*1.2;   //Brick texture
	}
    return vec3(d,col,notwaterdist); // distance,  colour mask, distance to nearest non-water object.
}

//Raymarch scene
vec4 RayMarch(vec3 ro, vec3 rd, bool detail, float msm) { // msm - max steps multiplier.
    float dO=0.0;
	vec3 dS=vec3(0.0,0.0,0.0);
    
    for(float i=0.0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*dO;
        dS = Map(p, detail,detail);
        dO += dS.x;
        if(dO>MAX_DIST || abs(dS.x)<SURF_DIST) break;
        if(p.y>2.5) {dO=MAX_DIST; break;}
    }
    return vec4(min(dO,MAX_DIST),dS.y,dS.z,0); // distance, colour mask, distance to non-water object, unused
}

//Get Normal
vec3 GetNormal(vec3 p) {
    vec3 d = Map(p, true, true);
    vec2 e = vec2(.01, 0);
    vec3 n = d.x - vec3(
        Map(p-e.xyy,true,true).x,
        Map(p-e.yxy,true,true).x,
        Map(p-e.yyx,true,true).x); //swizzle
    return normalize (n);
}

//Get Water Normal
vec3 GetWaterNormal(vec3 p) {
    float d = WaterDist(p);
    vec2 e = vec2(.01, 0);
    vec3 n = d - vec3(
        WaterDist(p-e.xyy),
        WaterDist(p-e.yxy),
        WaterDist(p-e.yyx)); //swizzle
    return normalize (n);
}

//Raymarch Soft Shadows
float RayMarchss(vec3 ro, vec3 rd, bool detail ) { // http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
    float dO=0.0;
	vec3 dS=vec3(0.0,0.0,0.0);
	float s = 1.0;
	float w = .3; //Shadow width
    
    for(float i=0.0; i<MAX_STEPS*.5; i++) {
        vec3 p = ro + rd*dO;
		dS = Map(p,false,detail);
        dO += dS.x;
		s = min( s, dS.x/(w*dO) );
        if (dO>MAX_DIST || abs(dS.x)<SURF_DIST || s<0.0) break;
    }
    
    s = max(s,0.0);
	return s;
}

//lighting
vec3 GetLight(vec3 p, bool detail) {
    vec3 n = GetNormal(p);
    float dif = clamp(dot(n, lightDir), 0.0, 1.0);
    float shadow=1.0;
	if (detail) shadow = RayMarchss( p+n*SURF_DIST*1.8, lightDir, true); //Shadows
	vec3 bounce = clamp(dot(n, vec3(0,-1,0)), 0.0, 1.0)*vec3(0.1284, 0.1694, 0.1082);
    return vec3 (1.124, 0.953, 0.500)*dif*shadow+bounce;  
}

//reflection
vec3 GetReflectionWater(vec3 p, vec3 rd) {
    vec3 n = GetWaterNormal(p);
    rd = reflect(rd,n); 
    vec4 d = RayMarch(p+n*SURF_DIST, rd, false,0.3); 
    float fresnel = 1.0-abs(dot(n, rd));
	p+=rd * d.x;
    vec3 col = GetLight(p, false);
	
	//Simple Colourize reflected Geo
	if (d.y < 1.5) col *= mix(vec3 (0.7725491, 0.4196079, 0.2196079), vec3 (0.9666667, 0.8254902, 0.709804), d.y*300.0);  //brick
	col = mix(col, mix(vec3 (0.7490196, 0.6352941, 0.3333333),vec3 (0.3137255, 0.2588235, 0.1215686),clamp(p.y*5.0,0.0,1.0)),clamp(d.x*.025,0.0,1.0)); //sky&fog
    return col*fresnel;
} 

float GetSpecular(vec3 p, vec3 rd) {
	vec3 n = GetNormal(p);
	rd = reflect(rd,n);
	return pow(dot(n,lightDir),3.0);
}

//...Main................................................................................................................//

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord/iResolution.xy;
    uv -= .5;
    uv.y*=iResolution.y/iResolution.x;
 
    vec3 ro = vec3(-.5,.5+sin((iTime-4.5)*.0982)*.4, -3.0+iTime);
    vec3 lookat = vec3(1.0+uv.x*(cos(uv.y+3.14)+1.0)*10.0, .2+uv.y*(cos(uv.x+3.14)+1.0)*-5.0 , iTime); //fish eye effect.
    vec3 f = normalize(lookat-ro);
    vec3 r = normalize(cross(vec3(0., 1., 0.),f));
    vec3 u = cross(f, r);
    vec3 rd = f + uv.x*r + uv.y*u;
    vec4 d = RayMarch(ro, rd, true, 1.0);
	vec3 p = ro + rd * d.x;
	vec3 col = GetLight(p, true);

// Colourize scene, 0 to1 - Brick 2 - Pendulum 3 - Water 10 - Sky

	if (d.y < 1.5) col *= mix(vec3 (0.7725491, 0.4196079, 0.2196079), vec3 (0.9666667, 0.8254902, 0.709804), d.y*300.0);  //brick
	if (d.y > 1.5 && d.y < 2.5) col *= vec3 (0.5529412, 0.2980392, 0.1411765)+GetSpecular(p,rd); //pendulum
	if (d.y > 2.5 && d.y < 3.5) col *= .5*mix(vec3 (0.0411765, 0.2215687, 0.6215686),vec3 (0.1411765, 0.6215687, 0.9215686),pow(clamp(1.0-d.z*.5,0.0,1.0),2.0))+GetReflectionWater(p,rd)*.5; //water, deep, shallow
	col = mix(col, mix(vec3 (0.7490196, 0.6352941, 0.3333333),vec3 (0.2537255, 0.2288235, 0.1415686),pow(clamp(p.y*.15,0.0,1.0),.4)),clamp(d.x*.025,0.0,1.0)); //sky&fog
    col += vec3(0.2431373,0.2588235,0.2039216)*.2; //ambient
	col *= pow(1.0-(pow(uv.x*1.4,2.0)+pow(uv.y*2.49,2.0)),.1); //Vignette
	
        fragColor =  vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}