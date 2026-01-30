/*
 * Original shader from: https://www.shadertoy.com/view/wtGfWw
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
#define time iTime
float PI = 3.1415926535;

vec2 pmod(vec2 p,float n){
  float np = 2.0*PI/n;
  float r = atan(p.x,p.y)-0.5*np;
  r = mod(r,np)-0.5*np;
  return length(p.xy)*vec2(cos(r),sin(r));
  
  }

float func(float x, float y, float z) {
    z = fract(z), x /= pow(2.,z), x += z*y;
    float v = 0.;
    for(int i=0;i<6;i++) {
        v += asin(sin(x)) * (1.-cos((float(i)+z)*1.0472));
        v /= 2., x /= 2., x += y;
    }
    return v * pow(2.,z);
}


mat2 rot (float r){
  
  return mat2(cos(r),sin(r),-sin(r),cos(r));
  }

 vec3 outco(vec2 p){
  vec3 col = vec3(0);
   vec2 ssp = p;
  float iter = 6.;
  float sit = 1.+floor(mod(time*108./60.,iter));
  for(int i = 0;i<6;i++){
    if(sit>float(i)){
       p *= rot(PI*float(i)/iter);
       p = pmod(p,3.);
    
      col += vec3(func(p.x,time*3.,-0.1*time));
      p = ssp;
     }
   
  }
  col /= sit;
  col *= (12.+sit)/12.;
  return col;
  }
  


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 p =uv- 0.5;
	p /= vec2(iResolution.y / iResolution.x, 1);
    vec2 sp = p;
    vec3 col = vec3(0);
  
    p *= 100.;

    p = sp;
    p += 0.1*func(uv.x*100.,uv.y*100.,time)*pow(abs(sin(8.*time*108./60.)),16.);
    float  scale = 800.;
    p *= scale;
    vec2 ep = 0.5*scale*vec2(0.01,0.01)*(uv-0.5);
    col.b += outco(p).r;
    p += ep;
    col.g += outco(p).r;
    p -=2.*ep; 
    col.r += outco(p).r;

  
  col *= 0.2+pow(abs(sin(4.*time*108./60.)),2.);
  col = 1.5*pow(col,vec3(1.4,1.4,1.2));
    fragColor = vec4(col,0.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}