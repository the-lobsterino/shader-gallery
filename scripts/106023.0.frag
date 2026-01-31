#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Heavily adapted from Inigo Quilez (https://iquilezles.org/)

const float D_MAX = 100000000.0;   // max marching distance

#define AA 9  // number of anti-aliasing passes

// SDFs

float sdBox( vec3 p, vec3 b ) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sceneSDFnoRep(vec3 samplePoint) {    
  return sdBox(samplePoint, vec3(0.25));
}

// SDF Transforms

// Repeat SDF infinitely
// c is ~size of repeated unit
float opRep( in vec3 p, in vec3 c){
  vec3 q = mod(p+0.5*c,c)-0.5*c;
  return sceneSDFnoRep( q );
}

// Scene SDF
float sceneSDF(vec3 samplePoint) {    
  return opRep(samplePoint, vec3(2.0));
}

// Calculates surface normal
vec3 calcNormal( in vec3 pos ) {
  vec2 e = vec2(1.0,-1.0)*0.5773;
  const float eps = 0.0005;  // small increment epsilon
  return normalize( e.xyy*sceneSDF( pos + e.xyy*eps ) + 
          e.yyx*sceneSDF( pos + e.yyx*eps ) + 
          e.yxy*sceneSDF( pos + e.yxy*eps ) + 
          e.xxx*sceneSDF( pos + e.xxx*eps ) );
}

// Apply fog
vec3 applyFog( in vec3  rgb,       // original color of the pixel
               in float dist,     // camera to point distance
               in float distFactor) {
  float fogAmount = 1.0 - exp( -dist * distFactor );
  vec3  fogColor  = vec3(0.0, 0.0, 0.0);
  return mix( rgb, fogColor, fogAmount );
}

vec3 mainImage( in vec2 fragCoord ) {

    float t = time;
    //t = 842.82;
    
// camera movement	
//  vec3 center = vec3( 0.30  - t, sin(t), sin(0.7*t)  + t );
//  vec3 eye = vec3( 1.30 - t, 0.4, -1.40 + t );
//  vec3 ww = normalize( center - eye );  // vect from center to eye

  vec3 ww = normalize( vec3(1.0, 1.0, 1.0) );  // vect from center to eye
  vec3 center = vec3(0.0, 0.55, 0.3) + 0.3*t*ww;
  //vec3 eye = vec3( 1.30 - t, 0.4, -1.40 + t );
  vec3 eye = center + ww;

// camera matrix
  vec3 uu = normalize( cross(ww, vec3(sin(0.02*t),cos(0.02*t),0.0)) );  // cross with up
  vec3 vv = normalize( cross(uu, ww) );

  vec3 tot = vec3(0.0);
  float dTot;  
  #if AA>1  // anti-aliasing passes

    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ ) {
    // pixel coordinates
    vec2 offset = vec2(float(m),float(n)) / float(AA) - 0.5;  // offset for anti-aliasing passes
    vec2 p = (-resolution.xy + 2.0*(fragCoord.xy+offset))/resolution.y;
    #else    
    vec2 p = (-resolution.xy + 2.0*fragCoord.xy)/resolution.y;
    #endif

    // create view ray
    vec3 ray = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // raymarch
    dTot = 0.0;
    for( int i=0; i<256; i++ ) {
      vec3 pos = eye + dTot*ray;
      float d = sceneSDF(pos);
      if( d < 0.0001 || dTot > D_MAX ) break;
      dTot += d;
    }
    
    // shading/lighting	
    vec3 color = vec3(0.0);
    if( dTot < D_MAX ) {
      vec3 pos = eye + dTot * ray;  // position of point on surface
      vec3 normal = calcNormal(pos);  // surface normal
      float diffuse = clamp( dot(normal, vec3(0.5)), 0.0, 1.0 );
      float ambient = 0.6 + 0.4 * dot(normal, normalize(vec3(0.2,0.50,-0.80)));
      color = vec3(0.45, 0.35, 0.25) * ambient + vec3(0.35, 0.5, 0.765) * diffuse;

      color = applyFog(color, dTot, 0.15);
    }

    // gamma        
    color = sqrt( color );
    tot += color;
    #if AA>1
  }
  tot /= float(AA*AA);  // take mean if multiple anti-aliasing passes
  #endif

  // some basic fog  
  #define d dTot
  #define c tot
  #define fogColor vec3( .1, .1, .33 )
  float fog = 0.005;  
  fog *= 1.;
  c = mix(c, fogColor, 1.0 - (1.0) / (1.0 + d*d*d*fog)); 
  return tot;	


//d=dist

}


void main( void ) 
{	
  gl_FragColor = vec4(mainImage(gl_FragCoord.xy), 1.0);
}