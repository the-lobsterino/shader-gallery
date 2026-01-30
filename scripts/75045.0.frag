/*
 * Original shader from: https://www.shadertoy.com/view/7sGGDw
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
#define rot(a) mat2(cos(a), sin(a) , -sin(a) ,cos(a))
float t = 0.;
float g1,g2,g3;
#define MAX_DIST 1500.

float sbt(vec3 p, vec2 s){
    return length(vec2( length(p.xy)-s.x, p.z))-s.y;
  }
  
  float h(float p){return fract(sin(p*345.4)*454.);}
  vec2 h(vec2 p){return fract(sin(p*345.4+p.yx*375.)*454.);}
    float c(float t){t*=.66;return mix(h(floor(t)), h(floor(t+1.)), pow(smoothstep(0., 1., fract(t)), 20.));}
    
  float smin(float a, float b, float k){
      float h = max(k-abs(a-b), 0.);
    return min(a,b)-h*h*k*.25;
    }
    vec3 smin(vec3 a, vec3 b, vec3 k){
      vec3 h = max(k-abs(a-b), 0.);
    return min(a,b)-h*h*k*.25;
    }
  #define ELAPSE sin(c(t)*.5)*20.
float m(vec3 p){
  p*=.66;
  p.yz*=rot(c(t*.35)*20.);
  vec3 p1 = p;
  float dd = length(p-vec3(3.))-.05;
  g1+=.1/(.1+dd*dd);
  p.y = p.y;
  float d = length(p)-1.;
  g3+=.1/(.1+d*d);
  vec3 p2 = p;
  p2.xy*=rot(p.z*.1);
  float d2 = sbt(p2,vec2(mod(ELAPSE,5.), .1));
  g2+=.1/(.1+d2*d2);
  float df = smin(smin(d, dd, 1.), d2, 1.);
  float dt = d2;
  for(float i = 0. ; i < 8.; i++){
    p.xz *= rot(p.y*.009*i);
    p.yz*=rot(c(t)*.275);
    p.xy = abs(p.xy)-10.;
    dt = sbt(p,vec2(mod(ELAPSE,i*i*i)+10., .001));
    df = smin(df, dt, 1.);
    g2 += .1/(.1+dt*dt);
  }
  
  return df;
}
vec3 nm(vec3 p){
  vec2 e = vec2(0.01, 0.);
    return normalize(
      e.xyy * (m(p+e.xyy)) +
      e.yyx * (m(p+e.yyx)) +
      e.yxy * (m(p+e.yxy)) +
      e.xxx * (m(p+e.xxx))
  );
}
bool hit = false;
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    t= mod(iTime, 100.);
	vec2 uv = vec2(fragCoord.x / iResolution.x, fragCoord.y / iResolution.y);
	uv -= 0.5;
	uv /= vec2(iResolution.y / iResolution.x, 1.);

  vec3 s = vec3(0.01, 0.01, -20.);
  s.xz*=rot(t*.75);
  s.yz*=rot(sin(t)*.5-.5);
  vec3 p = s;

  vec3 cz = normalize(vec3(0.)-s);
  vec3 cx = normalize(cross(cz,vec3(0., -1., 0.)));
  vec3 cy = normalize(cross(cx,cz));
  vec3 r=mat3(cx,cy,cz)*normalize(vec3(-uv, 1.-length(uv)*2.6));
  vec3 co = vec3(0.25)*(1.-length(uv)*.77);
  float d,dif;
  vec3 l = normalize(vec3(-1., 1., .5));
  vec3 n;
  
  for(float i = 0.; i < 64.; i++)
    if(d=m(p),p+=d*r, abs(d) < .0001){
      hit = !hit;
      n=pow(nm(p)*vec3(0.23, 0.34, 0.5), vec3(3.));
      dif = clamp(dot(l,n), 0., 1.);
      co += dif*vec3(0.02343);
      //d=0.;
      p=fract(p*p)*vec3(0.34,0.45,.45)*20., r=reflect(r,n),p+=.35;
    } else if(d > 100.){
      
        co=vec3(0.1, 0.52, .4)*vec3(0.085);
        break;
    }

  co += g1*vec3(0.5);
  co += g2*vec3(0.24, 0.64, 0.45)*.15;
  co -= g3*vec3(.16)*.45;
    
  co=pow(co, vec3(0.4545));
    
  co.y -= min(sin(t)*.25+.5,max(0., co.y));
    
  co=smoothstep(0., 1., co);
    
  //co *= 1.25-max(length(p-s)/(MAX_DIST),0.);
	fragColor = vec4(co, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}