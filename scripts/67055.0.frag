/*
 * Original shader from: https://www.shadertoy.com/view/wlXBWH
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
/**
	Fractal Experiment 05
	warp and fractal - more just playing around and 
	going Ooohh and Ahhh personally - fractals are
	not (mostly) productive but way fun to play with.

	fragtal() function based on map
	https://www.shadertoy.com/view/ttsBzM
	by @gaz

*/
#define MAX_STEPS 100
#define MAX_DIST 100.
#define EPSILON 0.0001
#define PI 3.14159265


mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
	return mat2(c, -s, s, c);
}

float sdSphere(vec3 p, float radius) { return length(p) - radius; }
float sdBox( vec3 p, vec3 b ) { vec3 q = abs(p) - b; return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0); }




float sdCylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdRay (vec3 p) {
  p.y -= 0.6;
  p.x = -abs(p.x);
  p.x -= 1.;
  p.xy *= Rot(PI / 16.);
  p.xz *= Rot(PI / 4.);
  return sdBox(p, vec3(.81, .8, .8));
}


float sdStar(vec3 p) {
  float r1, r2, r3, r4;
  r1 = r2 = r3 = r4 = 1e10;
  r1 = sdRay(p);
  //p.x = abs(p.x);
  //p.xy *= Rot(PI / 3.);
  //p.xy *= Rot(PI / 3.);
  //p.x = abs(p.x);
  vec3 p2 = p;
  p2.xy *= Rot(1.9106329);
  r2 = sdRay(p2);
  //p.xz *= Rot(1.9106329);
  vec3 p3 = p;
  p3.xz *= Rot(2. * PI / 3.);
  p3.xy *= Rot(1.9106329);
  r3 = sdRay(p3);
  vec3 p4 = p;
  p4.xz *= Rot(- 2. * PI / 3.);
  p4.xy *= Rot(1.9106329);
  r4 = sdRay(p4);
  return min(min(r1, r2),min(r3, r4));
}



// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

vec2 getDist(vec3 p) {
  p.y += 0.2;
  p.xz *= Rot(iTime);
  float sphere = (length(p) - 1.5) * .5;
  float fractal = sdStar(p);
  float scale = 0.7;
  vec3 shift = vec3(0, -1.5, 0);

  for (int i = 0; i < 1; i ++) {
    //p.xy *= Rot(PI / 3.);
    //p.x = abs(p.x);
    //p.xy *= Rot(PI / 3.);
    //p.x = abs(p.x);
    //p /= scale;
    //p.xy *= Rot(PI / 3.);
    //p.xz *= Rot(PI / (4. + 2. * sin(iTime))); // normally PI / 2.
    //p += shift;
    //fractal = min(fractal, sdStar(p) * pow(scale, (float(i + 1))));

      float r0, r1, r2, r3, r4;
      r0 = sdStar(p);
      r1 = r2 = r3 = r4 = 1e10;

      vec3 p1 = p;
      p1 += shift;
      p1 /= scale;
      p1.xz *= Rot(PI / 3.);
      r1 = sdStar(p1);
      //p.x = abs(p.x);
      //p.xy *= Rot(PI / 3.);
      //p.xy *= Rot(PI / 3.);
      //p.x = abs(p.x);
      vec3 p2 = p;
      p2.xy *= Rot(1.9106329);
      p2 += shift;
      p2 /= scale;
      r2 = sdStar(p2);
      //p.xz *= Rot(1.9106329);
      vec3 p3 = p;
      p3.xz *= Rot(2. * PI / 3.);
      p3.xy *= Rot(1.9106329);
      p3 += shift;
      p3 /= scale;
      r3 = sdStar(p3);
      vec3 p4 = p;
      p4.xz *= Rot(- 2. * PI / 3.);
      p4.xy *= Rot(1.9106329);
      p4 += shift;
      p4 /= scale;
      r4 = sdStar(p4);
      fractal = min(min(min(r0, r1 * scale), r2 * scale),min(r3 * scale, r4 * scale));
  }
  return vec2(mix(fractal, sphere, 0.5 + 0.5 * sin(iTime * 1.)), 0.6);
  //return vec2(sdStar(p), 0.6);
}




// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑





vec2 rayMarch(vec3 ro, vec3 rd) {
	float d = 0.;
    float info = 0.;
    //float glow = 0.;
    float distToClosestLight = 9999999.;
    for (int i = 0; i < MAX_STEPS; i++) {
    	vec2 distToClosest = getDist(ro + rd * d);
        d += distToClosest.x;
        info = distToClosest.y;
        if(abs(distToClosest.x) < EPSILON || d > MAX_DIST) {
        	break;
        }
    }
    return vec2(d, info);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.);
    vec3 n = getDist(p).x - vec3(getDist(p - e.xyy).x,
                               getDist(p - e.yxy).x,
                               getDist(p - e.yyx).x);
	return normalize(n);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec3 col = vec3(0);
    
    // ray origin
    vec3 ro = vec3(0, 0., -5.5);
    float zoom = 1.100;
    
    // ray direction
    vec3 rd = normalize(vec3(uv, zoom));
    
    vec2 rm = rayMarch(ro, rd);
    float d = rm[0];
    float info = rm[1];
    
    float color_bw = 0.;
    vec3 color = vec3(0.);
    if (d < MAX_DIST) {
        vec3 n = getNormal(ro + rd * d);
        n.zy *= Rot(iTime);
    	color = vec3( n + 1.0 );
        color *= info;
        //color_bw += 0.5 + dot(n, normalize(vec3(1,1,0))) / 2.;
    }
    //color = vec3( color_bw );
    
    
    
    fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}