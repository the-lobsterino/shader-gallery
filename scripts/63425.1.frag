/*
 * Original shader from: https://www.shadertoy.com/view/MlKXzK
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
/* 
I wanted to practice designing scenes use SDF and raymarching so I threw this together over 
the last few days to see what I could come up with. its just a simple plane for the
ground and some normal mapping. Lots of code is borrowed or adapted from other
shaders here on the site.

Most heavily used:
https://www.shadertoy.com/view/MtdSRn
https://www.shadertoy.com/view/Xds3zN
*/


float hash(vec2 p) {
  p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
    return fract( p.x*p.y*(p.x+p.y) );
}

float noise(vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f*f*f*((6.0*f-15.0)*f+10.0);
  vec2 a = vec2(0.0, 1.0);
  float h = mix(mix(hash(p+a.xx), hash(p+a.yx), f.x), 
                mix(hash(p+a.xy), hash(p+a.yy), f.x), f.y);

  return h;
}

float groundDetail(vec2 x) {
  float h = 0.0;
  float a = 0.5;
  float p = 1.0;
  h = smoothstep(0.5, 1.0, noise(x*0.05))*2.0;
  for (int i = 0;i < 3;i++) {
    h+= noise(x*p)*abs(a);
    p*=2.0;
    a*=-0.5;
  }

  return h+cos(x.y*0.5)+sin((x.x+x.y)*0.4);
}

//sdPrimitives borrowed from iqs raymarching primitives
//https://www.shadertoy.com/view/Xds3zN
//and from http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdBox( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}

//from iq's smin article
//http://www.iquilezles.org/www/articles/smin/smin.htm
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 postPos(vec3 p) {
  return vec3(mod(p.x, 2.), p.yz)-(vec3(1.0, 0.25, 2.0));
}

float groundDistance(vec3 p) {
  float bfact =0.3;
  vec3 post = postPos(p+vec3(0.05, 0.25, 0.0));
  return smin( p.y, length(post)-0.01, bfact );
}

float postDistance(vec3 p) {
  float dist1 = sdCylinder(postPos(p), vec2(0.035, 0.25));

  return dist1;
}

float wireDistance(vec3 p) {
  float h = -abs(cos(p.x*3.14159/2.0))*0.05-0.07;
  float d = 1.0;
  for (int i=0;i<3;i++) {
    h+= sin(p.x+float(i)*17.49)*0.03;
  d = min(sdCapsule(postPos(p), vec3(-2.0, h+float(i)*0.1, .0), vec3(2.0, h+float(i)*0.1, .0), 0.002), d);
  }
  return d;
}

// Distance to ground, posts, and wire
vec2 map(vec3 p) { 
  vec2 d = opU( vec2(groundDistance(p), 1.0), 
             vec2(postDistance(p), 2.0)) ; 
  d = opU(d, vec2(wireDistance(p), 3.0));
  return d;
}

float detail(vec3 p) { 
    return (p.y - groundDetail(p.xz*32.0)*0.002); 
}

//normal functions adapted from Shane
//https://www.shadertoy.com/view/MtdSRn
vec3 normalMap(in vec3 p){
  
    vec2 e = vec2(-1., 1.)*.001;  
    
	float d1 = detail(p + e.yxx), d2 = detail(p + e.xxy);
	float d3 = detail(p + e.xyx), d4 = detail(p + e.yyy); 
    
    vec3 n1 = normalize(e.yxx*d1 + e.xxy*d2 + e.xyx*d3 + e.yyy*d4 );
	return n1;   
}

vec3 normal(in vec3 p){
  
    vec2 e = vec2(-1., 1.)*.001;  
    
	float d1 = map(p + e.yxx).x, d2 = map(p + e.xxy).x;
	float d3 = map(p + e.xyx).x, d4 = map(p + e.yyy).x; 
    
    vec3 n1 = normalize(e.yxx*d1 + e.xxy*d2 + e.xyx*d3 + e.yyy*d4 );
	return n1;   
}

//adapted from iq's raymarching primitives
//https://www.shadertoy.com/view/Xds3zN
float shadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<32; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, h*54.0 );
        t += clamp( h, 0.001, 0.1 );
        if( h<0.001 || t>tmax ) break;
    }
    return smoothstep(0.05, 0.2, res);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  float time = iTime;
    
    //uncomment to move camera and look around
  vec2 m = vec2(0.5);//(2.0*(iMouse.xy-(iResolution.xy*0.5)));
  // Unit direction ray.
  vec3 rd = normalize(vec3(fragCoord.xy - iResolution.y*.5+m, iResolution.y));
  
  // most of the main ray marching block is borrowed from Shane
  //https://www.shadertoy.com/view/MtdSRn
  vec3 ro = vec3(time*.4, .5, .2);
  vec2 d = vec2(0.0);
  float t = 0.0;
  for(int i=0; i<32; i++) {
	d = map(ro + rd*t); 
    
    if(abs(d.x)<.001*(t*.125 + 1.) || t>10.) break; 
    
    t += d.x;
  }
  //location of intersection
  vec3 sp = ro + rd*t;
  // light direction  
  vec3 ld = normalize(vec3(-0.276, cos(time)*0.35+0.3, 0.613));  
  //color of the sun
  vec3 sun = mix(vec3(1.0, .9, 0.7), vec3(1.0, 1.0, 0.95), ld.y);
  //fog color, runs from white to color of sky
  // then mixs in the sunset color based on height of sun
  vec3 fog = mix(vec3(1.0), vec3(.65, .77, .98), smoothstep(0.0, 0.5, rd.y));
  vec3 sunset = mix(vec3(1.04, 0.9, 0.7), vec3(1.04, .95, .87), smoothstep(0.0, 0.2, ld.y+(rd.y)));
  
  fog = mix(fog, sunset, smoothstep(.8, .99, pow(dot(rd, ld), 0.6*rd.y+ld.y*2.0)));

  //sky color with sun mixed in
  vec3 sky = mix(vec3(.65, .77, .98), sun, smoothstep(.98,1.0, pow(dot(rd, ld), 4.0)));

  //checks type of material intersected with and applys lighting based on that
  vec3 col;
  //snow
  if (d.y<1.9) {
  vec3 n = mix(normalMap(sp), vec3(0., 1., 0.), smoothstep(3.0, 6.0, t));
    
  float dif = max(dot(ld, n), 0.0);
  float spe = pow(max(dot(reflect(rd, n), ld), 0.), 32.)*0.6;

  dif *= shadow(sp, ld, 0.02, 2.0);
  col = sun*sun*spe+mix(sunset, vec3(0.9, 0.9, 1.0), ld.y*2.0)*dif;
  } else if (d.y<2.5) { //posts
    vec3 n = normal(sp);
    
    float dif = max(dot(ld, n), 0.0); 
    
    col = mix(sunset*sunset, vec3(0.5, 0.3, 0.05), ld.y*2.0)*dif;
  } else if (d.y>2.5) { //wire
   	vec3 n = normal(sp);
    
    float dif = max(dot(ld, n), 0.0); 
    float spe = pow(max(dot(reflect(rd, n), ld), 0.), 4.)*0.5;
    
    col = sun*sun*spe+mix(sunset*sunset, vec3(0.7), ld.y*2.0)*dif;
  }
  //mix the ground with the sky based on distance
  col = mix(col, sky, smoothstep(5.95, 6.0, t*ld.y));
  //mix the fog in overtop of everything else
  vec3 c = mix(col, fog*fog, smoothstep(0.0, 1.5, t*0.2));

  fragColor = vec4(c, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}