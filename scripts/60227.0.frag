#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iMouse mouse
#define iGlobalTime time
#define iResolution resolution

//---------------------------------------------------------
// Shader: 2dPrimitives.glsl by tHolzer
//         v1.0  2015-09-13  initial release
//         v1.1  2016-02-14  added primitives
//         v1.2  2016-03-30  circleBox added
//         v1.3  2016-08-15  line & line segment added
//         v1.4  2016-09-09  circle2 & ring2 segment added
//         v1.5  2017-02-17  code corrections
// Tags:   2d, primitives, line, disc, circle, rectangle, frame, backgrounds 
// Test frame for animated 2d primitives and different 2d backgrounds.
// Change background by pressing mouse button on different x positions.
// Y position of mouse changes the background speed.
// Note:     Will be enhanced from time to time...
// see also: http://glslsandbox.com/e#26010
//           https://www.shadertoy.com/view/XtjGzt
//           https://www.shadertoy.com/view/lsy3zz
//---------------------------------------------------------

const float HALF_PI = 1.57079632679;
const float      PI = 3.14159265359;
const float  TWO_PI = 6.28318530718;

vec2 uv;  // centered pixel position -1 .. 1

#define BACKGROUNDS 6

//---------------------------------------------------------
// get moving background texture
//---------------------------------------------------------
#define TILES_COUNT_X 4.0
#define TILES_COUNT_Y 3.0

#define iChannel0 0
#define iChannel1 1
#define iChannel2 2

vec3 pow3( vec3 i, float p ) {
	return vec3( pow( i.x, p ), pow( i.y, p ), pow( i.z, p ) );
}

vec4 sphereCoord(vec2 uv) {
	float theta = PI * uv.x * 2.5 + time*0.1;
	float phi = PI * uv.y * 2.5 - time*0.1;

	return vec4( pow3( vec3(
		cos(theta) * sin(phi),
		sin(theta) * sin(phi),
		-cos(phi)
	), 2.2 ), 1.0 );
}

vec4 texture(int channel, vec2 uv) {
    vec4 v = sphereCoord(mix((uv*2.0-1.0),uv,sin(time*0.01)*0.5+0.5));
    if ( channel == 0 ) {
      return v.xyzw;
    } else if ( channel == 1 ) {
      return 1.-v.xyzw;
    } else {
      return v.yxzw;
    }
}

vec3 BackgroundColor (vec2 position, int tilesTexture, vec2 resolution)
{
  //vec2 p = TILES_COUNT_X * position.xy / resolution.x;
  vec2 p = TILES_COUNT_Y * position.xy / resolution.y;
  return texture (tilesTexture, p).xyz;
}
//---------------------------------------------------------
// get pseudo 3d bump background
//---------------------------------------------------------
vec3 BumpyBackground (vec2 pos, int aTexture, float time)
{
  #define ANIMATE_TEXTURE true
  #define LINEAR_STEPS 20.0
  #define DISTANCE 0.16
  #define FEATURES 0.5

  vec3 color;
  vec2 dir = 0.6*vec2(pos - vec2(0.5, 0.5)) * (DISTANCE / LINEAR_STEPS);
  if (ANIMATE_TEXTURE)
    pos += time * vec2(0.3, 1e-5* sin(time));
    
  for (float i = 1.0; i < LINEAR_STEPS; i++) 
  {
    vec3 pixel1 = texture(aTexture, pos - i * dir).xyz;
      
      
    if (pow(length(pixel1) / 1.4, 0.20) * (1.0 - FEATURES)
       +pow(length(texture(aTexture, (pos - i * dir) * 2.0).rgb) / 1.4, 0.90) * FEATURES
       > i / LINEAR_STEPS) 
    color = pixel1 * i / LINEAR_STEPS;
    //color += 0.16 * pixel1 * i / LINEAR_STEPS;
  }
  return color;
}
//---------------------------------------------------------
// perspective ground texture
//---------------------------------------------------------
vec3 BaseGround (vec2 pos, int tilesTexture, float atime)
{
    vec3 camera = vec3(atime, 1.0, atime);
    vec3 raydelta = vec3(sin(pos.x)
                        ,abs(sin(pos.y)-0.88)
                        ,cos(pos.x));
    vec3 mapped = raydelta * (camera.y / raydelta.y) + camera;
    vec3 col = vec3(texture( tilesTexture, mapped.xz ));
//    col *= abs(pos.y - 1.0);  // darkness based on the horizon
    return col;
}
//---------------------------------------------------------
// pipe tunnel with 1 texture
//---------------------------------------------------------
vec3 PipeTunnel (vec2 pos, int tilesTexture, float atime)
{
    float a = atan(pos.y, pos.x);
    float r = sqrt(dot(pos, pos));
    vec2 p = mod(vec2(atime + 1.0 / r, a * 4.0 / TWO_PI ), 1.0);
    return r * texture(tilesTexture, p).xyz;
}
//---------------------------------------------------------
// square tunnel with 3 textures
//---------------------------------------------------------
vec3 SquareTunnel(in vec2 p, in float ttime)
{
    float r = pow( pow(p.x*p.x,6.0) + pow(p.y*p.y,6.0), 1.0/16.0 );
    vec2 pp = 2.0 * vec2 (ttime + 1.0/r, atan(p.y,p.x)/3.1416);
	
    vec3 col = vec3(0);
    if (p.y > 0.0)
         col = texture(iChannel1, pp).rgb; 
    else col = texture(iChannel0, pp).rgb;
    col = mix( col, texture(iChannel2, pp).rgb, smoothstep(0.9,1.1,abs(p.x/p.y) ) );
    return vec3( col*r);
}


//=== 2d geometric primitives ===

// y position ranges from -1.0 .. +1.0

// functions return intensity (0.0 .. 1.0) of antialiased

//---------------------------------------------------------
// draw endless line through point A and B with radius r
//---------------------------------------------------------
float line(vec2 P, vec2 A, vec2 B, float r)
{
	vec2 g = B - A;
    float d = abs(dot(normalize(vec2(g.y, -g.x)), P - A));
	return smoothstep(r, 0.5*r, d);
}

//---------------------------------------------------------
// draw segment line from point A to point B and radius r
//---------------------------------------------------------
float segment(vec2 P, vec2 A, vec2 B, float r)
{
    vec2 g = B - A;
    vec2 h = P - A;
    float d = length(h - g * clamp(dot(g, h) / dot(g,g), 0.0, 1.0));
	return smoothstep(r, 0.5*r, d);
}

//---------------------------------------------------------
// draw rectangle at pos(-1..+1) with given size
//---------------------------------------------------------
float rectangle(vec2 pos, vec2 size)
{
  size *= 0.5;
  vec2 r = abs(uv - pos - size) - size;
  return step( max(r.x,r.y),0.0);
}
//---------------------------------------------------------
// draw rectangle at pos with given size
//---------------------------------------------------------
float rectangle2(vec2 pos, vec2 size)
{
  return (step(pos.x, uv.x)         - step(pos.x + size.x,uv.x))
       * (step(pos.y - size.y,uv.y) - step(pos.y, uv.y));
}
//---------------------------------------------------------
// draw rounded rectangle
//---------------------------------------------------------
float roundedRectangle (vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(uv - pos),size) - size) - radius;
  return smoothstep(1.0, 0.0, d / thickness * 5.0);
}
//---------------------------------------------------------
// draw rectangle with rounded edges
//---------------------------------------------------------
float roundedFrame (vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(uv - pos),size) - size) - radius;
  return smoothstep(1.0, 0.0, abs(d / thickness) * 5.0);
}
//---------------------------------------------------------
// draw circle at pos with given radius
//---------------------------------------------------------
float circle(in vec2 pos, in float radius, in float halo)
{
  return clamp (halo * (radius - length(uv-pos)), 0.0, 1.0);
}
//---------------------------------------------------------
float circle2(vec2 pos, float radius, in float halo)
{
    return clamp(((1.0-(length(uv-pos)-radius))-0.99)*100.0, 0.0, 1.0);   
}

//---------------------------------------------------------
// interpolation between a circle and a box with rounded corner
//---------------------------------------------------------
float circleBox(vec2 pos            // position
               ,vec2 size           // shape size
               ,float cornerRadius  // radius of rounded box corner
               ,float between)      // interpolation value: 0.0 .. 1.0
{
  float sd = (length(uv-pos) - size.x); // circle
  size -= vec2(cornerRadius);           // rounded box
  vec2 d = (abs(uv-pos) - size);
  float box = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - cornerRadius;
  float v = (1.0 - between)*sd + box*between;  //mix
  return clamp (-88.0*v , 0.0, 1.0);
}

//---------------------------------------------------------
// return 2d rotation matrix
//---------------------------------------------------------
mat2 rotate2D(float angle)
{
  float c = cos(angle), s = sin(angle);
  return mat2(c, s, -s, c);
}

//---------------------------------------------------------
// squircle: a variable shape (star..rectangle..circle)
// http://en.wikipedia.org/wiki/Squircle
//---------------------------------------------------------
float squircle(vec2 pos, float radius, float power)
{
  vec2 p = abs(pos - uv) / radius;
  float d = (pow(p.x,power) + pow(p.y, power) - pow(radius, power)) -1.0;
  return 1.0 - clamp (16.0*d, 0.0, 1.0);
}
//---------------------------------------------------------
// draw ring at given position
//---------------------------------------------------------
float ring(vec2 pos, float radius, float thick)
{
  return mix(1.0, 0.0, smoothstep(thick, thick + 0.01, abs(length(uv-pos) - radius)));
}
//---------------------------------------------------------
float ring2(vec2 pos, float radius, float thick)
{
    return clamp(((1.0-abs(length(uv-pos)-radius))-1.00+thick)*100.0, 0.0, 1.0); 
}
//---------------------------------------------------------
// draw ring at pos 
//---------------------------------------------------------
float haloRing(vec2 pos, float radius, float lineSize)
{
  return clamp(-(abs(length(uv+pos) - radius) * 100.0 / lineSize) + 0.9, 0.0, 1.0);
}
//---------------------------------------------------------
// draw polygon with n edges at pos 
//---------------------------------------------------------
float polygon(vec2 pos, float n, float radius)
{
  vec2 p = uv - pos;
  float angle = atan(p.x, p.y) + PI;
  float r = TWO_PI / n;
  float d = cos(floor(0.5 + angle / r) * r - angle) * length(p) / radius;
  return smoothstep(0.41,0.4,d);
}

//---------------------------------------------------------
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  float time = iGlobalTime;
  vec2 pos, size;
  vec2 npos = fragCoord.xy / iResolution.xy;   // 0.0 .. 1.0
  
  // get uv position with origin at window center
  float aspect = iResolution.x / iResolution.y;   // aspect ratio x/y
  vec2 ratio = vec2(aspect, 1.0);                 // aspect ratio (x/y,1)     
  uv = (2.0 * npos - 1.0) * ratio;             // -1.0 .. 1.0
    
  vec2 mpos = iMouse.xy / iResolution.xy;      //  0.0 .. 1.0
  vec2 mp = (2.0 * mpos - 1.0) * ratio;        // -1.0 .. 1.0  
  float speed = (mpos.y - 0.4) * time;    
    
  vec3 col;
  int selection = int((iMouse.x ) * float(BACKGROUNDS));
    
  if (selection == 5)   
    col = BackgroundColor(fragCoord, iChannel0, iResolution.xy);
    
  else if (selection == 4)
    col = BackgroundColor(fragCoord+vec2(-180.0*speed,0.0), iChannel0, iResolution.xy);
      
  else if (selection == 3)
    col = BumpyBackground (uv, iChannel2, 4.0 * speed);

  else if (selection == 2)
    col = BaseGround(npos, iChannel1, speed);

  else if (selection == 1)
    col = PipeTunnel(uv, iChannel1, speed);
      
  else
    col = SquareTunnel(uv, speed);

  float intensity = 0.0;
      
  //--- line --- 
  pos = vec2(-0.5*sin(time), 0.0);
  const vec3 lineColor1 = vec3(0.1, 0.4, 0.7);
  intensity = line (uv, pos, mp, 0.016);
  if ((intensity > 0.0) && (intensity <= 1.0))
    col = mix(col, lineColor1, intensity);
    
  //--- line segment --- 
  const vec3 lineColor2 = vec3(0.9, 0.9, 0.2);
  intensity = segment (uv, pos, mp, 0.02);     
  if ((intensity > 0.0) && (intensity <= 1.0))
    col = mix(col, lineColor2, intensity);
    
  //--- green rectangle ---
  const vec3 rectangleColor = vec3(0.2, 0.8, 0.5);
  intensity = 0.6 * rectangle (vec2(sin(time),-0.9),vec2(0.5, 0.1));
  col = mix(col, rectangleColor.rgb, intensity);

  //--- rounded rectangle ---
  const vec3 rectColor = vec3(0.1, 0.8, 0.5);
  pos = vec2(-sin(time), 0.6);
  size = vec2(0.16, 0.02);
  intensity = 0.6 * roundedRectangle (pos, size, 0.1, 0.2);
  col = mix(col, rectColor, intensity);
    
  //--- rounded frame ---
  const vec3 frameColor = vec3(0.5, 0.4, 0.6);
  size = vec2(0.28, 0.10);
  intensity = roundedFrame (pos, size, 0.08, 0.2);
  col = mix(col, frameColor, intensity);
    
  //--- red dot ---
  const vec3 circleColor2 = vec3(0.6, 0.2, 0.2);
  vec2 redPos = vec2(-0.5*sin(time), 0.0);
  intensity = circle(redPos, 0.05, 100.0);
  col = mix(col, circleColor2, intensity);

  //--- mouse dot ---
  if (0.0 == step(iMouse.x , 0.5)) 
  {
    const vec3 circleColorM = vec3(1.6, 1.2, 0.6);
    intensity = circle(mp, 0.05, 100.0);
    col = mix(col, circleColorM, intensity);
  }

  //--- yellow circle ---
  const vec3 circleColor = vec3(1, 0.8, 0.3);
  intensity = circle(vec2(sin(time), 0.6), 0.2, 16.);
  col = mix(col, circleColor, intensity);

  //--- violet circleBox ---
  const vec3 cbColor = vec3(0.5, 0.3, 0.8);
  pos = vec2(-sin(time), -0.6);
  float between = 0.5+0.5*sin(time);  // mix value
  size = vec2(0.15, 0.10);
  intensity = 0.8 * circleBox(pos, size, 0.02, between);
  col = mix(col, cbColor, intensity);
  
  //--- brown squircle ---
  const vec3 sqColor = vec3(0.8, 0.5, 0.3);
  pos = vec2(1.3, 0.6*sin(time+HALF_PI));
  float power = 0.8 + 2.0*(1.0+sin(time));
  intensity = 0.9 * squircle (pos, 0.1, power);
  if (intensity > 0.0) 
    col = mix(col, sqColor, intensity);
  
  //--- pink ring ---
  vec3 ringColor = vec3(0.9, 0.4, 0.6);
  pos = vec2(0.5*sin(time), 0.0);
  intensity = ring(pos, 0.2 +0.05*sin(time), 0.04);
  if (intensity > 0.0) 
    col = mix(col, ringColor, intensity);
  
  //--- haloRing ---
  ringColor = vec3(1.0, 1.0, 1.5);
  intensity = haloRing (vec2(sin(time), 0.0), 0.3, 6.0);
  col = mix(col, ringColor, intensity);
  
  //--- polygon ---
  const vec3 polygonColor = vec3(0.5, 0.9, 0.3);
  pos = vec2(sin(time), -0.5);

  float n = floor (6.0 + 3.0 * sin(time));
  intensity = 0.8 * polygon(pos,n, 0.4);
  col = mix(col, polygonColor.rgb, intensity);
    
  fragColor = vec4 (col, 1.0);
}


void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy );

}
