/*
 * Original shader from: https://www.shadertoy.com/view/3scGR7
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform vec2 mouse;
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define STEPS 50.
#define PI 3.14159
#define TAU (2.*PI)
#define sdist(v,s) (length(v)-s)
//#define time iTime
#define repeat(v,s) (mod(v,s)-s/2.)

mat2 rot (float a) {
  float c=cos(a),s=sin(a);
  return mat2(c,-s,s,c);
}

void amod (inout vec2 p, float count) {//  количество
  float an = TAU/count;
  float a = atan(p.y,p.x)+an/2.;
  a = mod(a,an)-an/2.;
  p = vec2(cos(a),sin(a))*length(p);
}

float map (vec3 pos) {
  float scene = 1000.;
pos.xz *= rot(length(pos)*.09);
pos.xy *= rot(length(pos)*.08);
    pos.xz *= rot(time*.5);
    pos.xy *= rot(time*.8);

  vec3 p = pos;//             обнулить pos для следующей фигуры верёвки
   p.xz *= rot(p.y*.5);//     вращение по y
  amod(p.xz, 15.);//          количество 5
  p.x -= 1. + .5 * sin(p.y+time);//диаметр вращения по y
  p.y = repeat(p.y+time*2., .1);//#define repeat(v,s)(mod(v,s)-s/2.)//  частота по y, s=1.0 редко-часто 11  1.0  0.1-часто
          //scene = sdist(p, .091);//  .01 #define sdist(v,s)(length(v)-s)// толще-тоньше s=0.1 средне
          //scene = min(scene, max(sdist(p.yz, .091),p.x));     //рёбра .01
   scene = min(scene, sdist(p.xz, .091));// верёвки .01------------

    p = pos;//                  обнулить pos для следующей фигуры  тарелочки в направляющих
  p.y = repeat(p.y - time, 3.);//  частота тарелочек по y, s=1.0 редко-часто 11  1.0  0.1-часто
  //float wave = 1. * sin(p.y*5.+time);
  //p.x = repeat(p.x, 5.);
  scene = min(scene, max(sdist(p.xz, 1.), abs(p.y)-.01));// тарелочки---------
  amod(p.xz, 7.);//         количество 5    дырки в тарелочках
          p.x -= .5;
  scene = max(scene, -sdist(p.xz, .2));//дырки в тарелочках--------------
          p.x -= 6.;//                          диаметр многоугольника
  scene = min(scene, sdist(p.xy, .051));//  толщина многоугольника--------------
  scene = min(scene, sdist(p.xz, .102));//  толщина направляющих-------------
  
  p = pos;//                  обнулить pos для следующей фигуры    бусы
  amod(p.xz,1.);//         количество плоскостей 32
  p.x -= 2.;
  p.y = repeat(p.y, .5);// .5  расстояние между бусинами      частота по y, s=1.0 редко-часто 11  1.0  0.1-часто
  p.x = repeat(p.x-time*.1, .5);// 1.0 расстояние между нитками  частота по x, s=1.0 редко-часто 11  1.0  0.1-часто
  //scene = min(scene, sdist(p, .1092));//  шары на бусах .02--------------
  //scene = min(scene, sdist(p.xz, .01));//  толщина бус .01---------------

  p = pos;//                  обнулить pos для следующей фигуры   круг
  float pl = length(p)*2.-time*.5;//  количество перекрутов
  float lod = 55.2;//                 количество линий в перекрутах
  pl = floor(pl*lod)/lod;
           p.xy *= rot(pl);//         вращение перекрутов
           scene = min(scene, max(sdist(p.xz, 3.85), abs(p.y)-.0091));//  масштаб=3.5 и яркость=.001 перекрута-------------
  
  p = pos;//                 обнулить pos для следующей фигуры  линии
  amod(p.xz, 1.);//         количество плоскостей 3
  p.x -= 2.;
  p.x = repeat(p.x+ time*.1, .2);//  расстояние между линиями
  scene = min(scene, sdist(p.xz, .0091));//  толщина линий----------------
return scene;

} 
void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
  vec2 uv=vec2(fragCoord.x/iResolution.x,fragCoord.y/iResolution.y);
  uv-=.5;
  uv/=vec2(iResolution.y/iResolution.x,1);
  vec3 eye = vec3(-mouse.x*18.+9.,-mouse.y*10.+5.,-8);//-6
  vec3 ray = normalize(vec3(uv, 1.));
  vec3 pos = eye;
  float shade = 0.;
  for (float i =0.; i <= 1.; i += 1./STEPS) 
  {
    
    float dist = map(pos);
    if (dist < .001) {
      shade = 1.-i;
      break;
   }
    dist *= .9;
    pos += dist * ray;
  }
 vec4 out_color=vec4(1.);
  vec4 color=vec4((sin(time/2.)+1.)/2.,cos(time)+1.,sin(time),(cos(time*2.)+1.)/2.);
  color*=shade;
  out_color=color;
  fragColor=vec4(out_color);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}