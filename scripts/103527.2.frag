/*
 * Original shader from: https://www.shadertoy.com/view/clyGWw
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// Emulate some GLSL ES 3.x
float tanh(float x) {
    float ex = exp(2.0 * x);
    return ((ex - 1.) / (ex + 1.));
}

// --------[ Original ShaderToy begins here ]---------- //
float bpm=0.;
vec3 erot(vec3 p,vec3 ax,float t){
  return mix(dot(ax,p)*ax,p,cos(t))+cross(ax,p)*sin(t);
}
float rand(vec2 p){
  return fract(535.55*cos(dot(p,vec2(85.5,479.5))));
}

float terr(vec3 p){
  float d=0.;
  float i=.5;
  for(int ii=0;ii<4;ii++){       
    d+= dot(asin(sin(erot(p*i,vec3(0.,1.,0),i))),vec3(.5))/i/4.;
    i+=i;
  }           
  return d;
}
vec2 sdf(vec3 p){
  vec2 h;
  vec3 hp=p;
  float ff = 1.-tanh(abs(hp.x)-1.);
  h.x  = dot(hp,vec3(0.,1.,0.))+1.+ff+terr(hp)+texture(iChannel0,fract(vec2(.3+ff*.01))).r;;
  h.y= 1.;

  vec2 t;
  vec3 tp=p;
      
  tp.y +=1.;
  float gy = dot(sin(tp*1.5),cos(tp.zxy));
  tp+=gy*.1;
  tp= erot(tp,vec3(0,0,1),tp.z);
  tp.xy= abs(tp.xy)-.2;tp.xy=abs(tp.xy)-.1;
  t.x =  max(abs(tp.z-bpm)-5.,length(tp.xy)-.02);
  t.y = 2.;
  h=t.x < h.x ? t:h;
  return h;
}

#define q(s) s*sdf(p+s).x
  
vec3 norm(vec3 p,float ee){vec2 e=vec2(-ee,ee);return normalize(q(e.xyy)+q(e.yxy)+q(e.yyx)+q(e.xxx));}
  
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

  vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
  bpm = +iTime*2.;
  bpm+=+rand(uv)*.1;
  vec3 col = vec3(0.);
   
  vec3 ro=vec3(1.,1.,bpm+(bpm));

  vec3 z=normalize(ro),x=normalize(cross(z,vec3(0.,-1.,0))),y=cross(z,x);  
  vec3 rd = mat3(x,y,z)*normalize(vec3(uv,1.+sin(bpm)*.1));
  
  vec3 rp= ro;
  // AZERTY FOR THE WIN
  vec3 light = normalize(vec3(1.,2.,-3.));
  for(float i=0.;i<128.;i++){
      //if (dd >= 50.) break;
      vec2 d = sdf(rp);
      if(d.y ==2.){
        d.x = max(.001,abs(d.x));
      }
      rp+=rd*d.x;
      if(d.x < .001){
        vec3 n = norm(rp,.005);
        vec3 n2 = norm(rp,.007);
        float dif = max(0.,dot(light,n));
        float fr= pow(1.+dot(rd,n),4.);
        col = +dif * vec3(.1);
        if(d.y==1.){
          col  += smoothstep(.001,.1,length(n-n2))+fr*vec3(1.,.7,.3)*max(0.,1.-abs(rp.z-bpm-5.)*.2);
          rd= reflect(rd,n);
          rp+=rd*.1;
          continue;
        }
           break;
         
         }
    }
    // Output to screen
    fragColor = vec4(sqrt(col),1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}