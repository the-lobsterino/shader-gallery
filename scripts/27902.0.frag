#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere35(vec3 center, float radius, vec3 pt)
{
   pt-=center;
   return length(pt)-radius;
}
vec3 sphere_color35(vec3 center, float radius, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float plane5(vec3 pt, vec3 center, vec3 u_x, vec3 u_y, float sx, float sy)
{
   pt-=center;
   vec3 normal = normalize(cross(u_x, u_y));
   float val = dot(pt, normal);
   return val;
}
vec3 plane_color5(vec3 pt, vec3 center, vec3 u_x, vec3 u_y, float sx, float sy)
{
   float v_x = dot(pt-center, u_x)/length(u_x)/length(u_x);
   float v_y = dot(pt-center, u_y)/length(u_y)/length(u_y);
   v_x/=sx;
   v_y/=sy;
   v_x = abs(fract(v_x));
   v_y = abs(fract(v_y));
   return vec3(v_x,v_y,1.0);
}
float grayscale6(vec3 pt, float time)
{
   return plane5(pt,vec3(0.0, 100.0, 0.0),vec3(4.0, 0.0, 0.0),vec3(0.0, 0.0, 4.0),100.0,100.0);
}
vec3 grayscale_color6(vec3 pt, float time)
{
  vec3 col = plane_color5(pt,vec3(0.0, 100.0, 0.0),vec3(4.0, 0.0, 0.0),vec3(0.0, 0.0, 4.0),100.0,100.0);
  float c = (col.x+col.y+col.z+1.0)/4.0;
  return vec3(c,c,c);
}
float sphere1(vec3 center, float radius, vec3 pt)
{
   pt-=center;
   return length(pt)-radius;
}
vec3 sphere_color1(vec3 center, float radius, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float sphere2(vec3 center, float radius, vec3 pt)
{
   pt-=center;
   return length(pt)-radius;
}
vec3 sphere_color2(vec3 center, float radius, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float and_not3(vec3 pt)
{
   float v1 = sphere1(vec3(0.0, 0.0, 0.0),1000.0,pt);
   float v2 = sphere2(vec3(0.0, 0.0, 0.0),990.0,pt);
   float res = max(v1,-v2);
   return res;
}
vec3 and_not_color3(vec3 pt)
{
   float v = sphere1(vec3(0.0, 0.0, 0.0),1000.0,pt);
   if (v>-0.8 && v<0.8) return sphere_color1(vec3(0.0, 0.0, 0.0),1000.0,pt);
   return sphere_color2(vec3(0.0, 0.0, 0.0),990.0,pt);
}
float color_choose4(vec3 pt, vec3 color) {
   return and_not3(pt);
}
vec3 color_choose_color4(vec3 pt, vec3 color) {
   return color;
}
float or_elem7(vec3 pt)
{
   float v1 = grayscale6(pt,time);
   float v2 = color_choose4(pt,vec3(0.7, 0.8, 1.0));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color7(vec3 pt)
{
   float val = grayscale6(pt,time);
   if (val>-0.8 && val<0.8) return grayscale_color6(pt,time);
   return color_choose_color4(pt,vec3(0.7, 0.8, 1.0));
}
float rbox16(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color16(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float cube18(vec3 tl, vec3 br, vec3 pt)
{
   pt-=tl;   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s,0.0));
}
vec3 cube_color18(vec3 tl, vec3 br, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem29(vec3 pt)
{
   float v1 = rbox16(pt,vec3(5.0, 70.0, -10.0),vec3(30.0, 100.0, 10.0),5.0);
   float v2 = cube18(vec3(5.0, 90.0, -5.0),vec3(30.0, 100.0, 20.0),pt);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color29(vec3 pt)
{
   float val = rbox16(pt,vec3(5.0, 70.0, -10.0),vec3(30.0, 100.0, 10.0),5.0);
   if (val>-0.8 && val<0.8) return rbox_color16(pt,vec3(5.0, 70.0, -10.0),vec3(30.0, 100.0, 10.0),5.0);
   return cube_color18(vec3(5.0, 90.0, -5.0),vec3(30.0, 100.0, 20.0),pt);
}
float trans30(vec3 pt, vec3 delta)
{
   pt-=delta;
   return or_elem29(pt);
}
vec3 trans_color30(vec3 pt, vec3 delta)
{
    pt-=delta;
    return or_elem_color29(pt);
}
float rbox11(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color11(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float rbox13(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color13(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem22(vec3 pt)
{
   float v1 = rbox11(pt,vec3(-50.0, 0.0, -10.0),vec3(-30.0, 50.0, 10.0),5.0);
   float v2 = rbox13(pt,vec3(-50.0, 50.0, -10.0),vec3(-30.0, 70.0, 10.0),5.0);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color22(vec3 pt)
{
   float val = rbox11(pt,vec3(-50.0, 0.0, -10.0),vec3(-30.0, 50.0, 10.0),5.0);
   if (val>-0.8 && val<0.8) return rbox_color11(pt,vec3(-50.0, 0.0, -10.0),vec3(-30.0, 50.0, 10.0),5.0);
   return rbox_color13(pt,vec3(-50.0, 50.0, -10.0),vec3(-30.0, 70.0, 10.0),5.0);
}
float rotx23(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(          vec3(1.0, 0.0, 0.0),
          vec3(0.0,cos(angle),sin(angle)),
          vec3(0.0,-sin(angle),cos(angle)));
   float v1 = or_elem22(center+m*(pt-center));
   return v1;
}
vec3 rotx_color23(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(          vec3(1.0, 0.0, 0.0),
          vec3(0.0,cos(angle),sin(angle)),
          vec3(0.0,-sin(angle),cos(angle)));
   vec3 v1 = or_elem_color22(center+m*(pt-center));
   return v1;
}
float rbox14(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color14(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem24(vec3 pt)
{
   float v1 = rotx23(pt,vec3(-40.0, 10.0, 0.0),1.5*cos(time*3.0+3.14159));
   float v2 = rbox14(pt,vec3(-30.0, 20.0, -20.0),vec3(30.0, 70.0, 20.0),5.0);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color24(vec3 pt)
{
   float val = rotx23(pt,vec3(-40.0, 10.0, 0.0),1.5*cos(time*3.0+3.14159));
   if (val>-0.8 && val<0.8) return rotx_color23(pt,vec3(-40.0, 10.0, 0.0),1.5*cos(time*3.0+3.14159));
   return rbox_color14(pt,vec3(-30.0, 20.0, -20.0),vec3(30.0, 70.0, 20.0),5.0);
}
float sphere8(vec3 center, float radius, vec3 pt)
{
   pt-=center;
   return length(pt)-radius;
}
vec3 sphere_color8(vec3 center, float radius, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float rbox9(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color9(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem19(vec3 pt)
{
   float v1 = sphere8(vec3(0.0, -30.0, 0.0),30.0,pt);
   float v2 = rbox9(pt,vec3(-30.0, 0.0, -20.0),vec3(30.0, 20.0, 20.0),5.0);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color19(vec3 pt)
{
   float val = sphere8(vec3(0.0, -30.0, 0.0),30.0,pt);
   if (val>-0.8 && val<0.8) return sphere_color8(vec3(0.0, -30.0, 0.0),30.0,pt);
   return rbox_color9(pt,vec3(-30.0, 0.0, -20.0),vec3(30.0, 20.0, 20.0),5.0);
}
float or_elem25(vec3 pt)
{
   float v1 = or_elem24(pt);
   float v2 = or_elem19(pt);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color25(vec3 pt)
{
   float val = or_elem24(pt);
   if (val>-0.8 && val<0.8) return or_elem_color24(pt);
   return or_elem_color19(pt);
}
float rbox10(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color10(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float rbox12(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color12(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem20(vec3 pt)
{
   float v1 = rbox10(pt,vec3(30.0, 0.0, -10.0),vec3(50.0, 50.0, 10.0),5.0);
   float v2 = rbox12(pt,vec3(30.0, 50.0, -10.0),vec3(50.0, 70.0, 10.0),5.0);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color20(vec3 pt)
{
   float val = rbox10(pt,vec3(30.0, 0.0, -10.0),vec3(50.0, 50.0, 10.0),5.0);
   if (val>-0.8 && val<0.8) return rbox_color10(pt,vec3(30.0, 0.0, -10.0),vec3(50.0, 50.0, 10.0),5.0);
   return rbox_color12(pt,vec3(30.0, 50.0, -10.0),vec3(50.0, 70.0, 10.0),5.0);
}
float rotx21(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(          vec3(1.0, 0.0, 0.0),
          vec3(0.0,cos(angle),sin(angle)),
          vec3(0.0,-sin(angle),cos(angle)));
   float v1 = or_elem20(center+m*(pt-center));
   return v1;
}
vec3 rotx_color21(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(          vec3(1.0, 0.0, 0.0),
          vec3(0.0,cos(angle),sin(angle)),
          vec3(0.0,-sin(angle),cos(angle)));
   vec3 v1 = or_elem_color20(center+m*(pt-center));
   return v1;
}
float or_elem26(vec3 pt)
{
   float v1 = or_elem25(pt);
   float v2 = rotx21(pt,vec3(40.0, 10.0, 0.0),1.5*cos(time*3.0));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color26(vec3 pt)
{
   float val = or_elem25(pt);
   if (val>-0.8 && val<0.8) return or_elem_color25(pt);
   return rotx_color21(pt,vec3(40.0, 10.0, 0.0),1.5*cos(time*3.0));
}
float or_elem31(vec3 pt)
{
   float v1 = trans30(pt,vec3(0.0,0.0,10.0*cos(time*3.0+3.14159)));
   float v2 = or_elem26(pt);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color31(vec3 pt)
{
   float val = trans30(pt,vec3(0.0,0.0,10.0*cos(time*3.0+3.14159)));
   if (val>-0.8 && val<0.8) return trans_color30(pt,vec3(0.0,0.0,10.0*cos(time*3.0+3.14159)));
   return or_elem_color26(pt);
}
float rbox15(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color15(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float cube17(vec3 tl, vec3 br, vec3 pt)
{
   pt-=tl;   vec3 s = br-tl;
   s/=2.0;
   pt-=s;
   return length(max(abs(pt)-s,0.0));
}
vec3 cube_color17(vec3 tl, vec3 br, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem27(vec3 pt)
{
   float v1 = rbox15(pt,vec3(-30.0, 70.0, -10.0),vec3(-5.0, 100.0, 10.0),5.0);
   float v2 = cube17(vec3(-30.0, 90.0, -5.0),vec3(-5.0, 100.0, 20.0),pt);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color27(vec3 pt)
{
   float val = rbox15(pt,vec3(-30.0, 70.0, -10.0),vec3(-5.0, 100.0, 10.0),5.0);
   if (val>-0.8 && val<0.8) return rbox_color15(pt,vec3(-30.0, 70.0, -10.0),vec3(-5.0, 100.0, 10.0),5.0);
   return cube_color17(vec3(-30.0, 90.0, -5.0),vec3(-5.0, 100.0, 20.0),pt);
}
float trans28(vec3 pt, vec3 delta)
{
   pt-=delta;
   return or_elem27(pt);
}
vec3 trans_color28(vec3 pt, vec3 delta)
{
    pt-=delta;
    return or_elem_color27(pt);
}
float or_elem32(vec3 pt)
{
   float v1 = or_elem31(pt);
   float v2 = trans28(pt,vec3(0.0,0.0,10.0*cos(time*3.0)));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color32(vec3 pt)
{
   float val = or_elem31(pt);
   if (val>-0.8 && val<0.8) return or_elem_color31(pt);
   return trans_color28(pt,vec3(0.0,0.0,10.0*cos(time*3.0)));
}
float or_elem34(vec3 pt)
{
   float v1 = or_elem7(pt);
   float v2 = or_elem32(pt);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color34(vec3 pt)
{
   float val = or_elem7(pt);
   if (val>-0.8 && val<0.8) return or_elem_color7(pt);
   return or_elem_color32(pt);
}
float from_obj_color33(vec3 pt, float time) {
    return or_elem7(pt);
}
vec3 from_obj_color_color33(vec3 pt, float time) {
   return or_elem_color7(pt);
}
float bounding_prim_36(vec3 pt)
{
    float dist = sphere35(vec3(0.0, 50.0, 0.0),120.0,pt);
    if (dist < 0.0) {
       return or_elem34(pt);
    } else {
       return from_obj_color33(pt,time);
    }
}
vec3 bounding_prim_color_36(vec3 pt)
{
    float dist = sphere35(vec3(0.0, 50.0, 0.0),120.0,pt);
    if (dist < 0.0) {
       return or_elem_color34(pt);
    } else {
       return from_obj_color_color33(pt,time);
    }
}
float roty37(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(vec3(cos(angle),0.0,sin(angle)),
          vec3(0.0, 1.0, 0.0),
          vec3(-sin(angle),0.0,cos(angle)));
   float v1 = bounding_prim_36(center+m*(pt-center));
   return v1;
}
vec3 roty_color37(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(vec3(cos(angle),0.0,sin(angle)),
          vec3(0.0, 1.0, 0.0),
          vec3(-sin(angle),0.0,cos(angle)));
   vec3 v1 = bounding_prim_color_36(center+m*(pt-center));
   return v1;
}
float from_obj_color38(vec3 pt, float time) {
    return roty37(pt,vec3(0.0,0.0,0.0),time/1.25);
}
vec3 from_obj_color_color38(vec3 pt, float time) {
   return roty_color37(pt,vec3(0.0,0.0,0.0),time/1.25);
}
vec3 normal39(vec3 pt, float time)
{
  float fx = from_obj_color38(pt+vec3(1.0,0.0,0.0),time) - from_obj_color38(pt-vec3(1.0,0.0,0.0),time);
  float fy = from_obj_color38(pt+vec3(0.0,1.0,0.0),time) - from_obj_color38(pt-vec3(0.0,1.0,0.0),time);
  float fz = from_obj_color38(pt+vec3(0.0,0.0,1.0),time) - from_obj_color38(pt-vec3(0.0,0.0,1.0),time);
  return normalize(vec3(-fx,-fy,-fz))/2.0+vec3(0.5,0.5,0.5);
}
float obj39(vec3 pt, float time)
{
   return from_obj_color38(pt,time);
}
vec3 obj_color39(vec3 pt, float time)
{
   return normal39(pt,time);
}
float color_mix40(vec3 pt, float t) {
   return roty37(pt,vec3(0.0,0.0,0.0),time/1.25);
}
vec3 color_mix_color40(vec3 pt, float t) {
   vec3 col1 = roty_color37(pt,vec3(0.0,0.0,0.0),time/1.25);
   vec3 col2 = obj_color39(pt,time);
   return mix(col1, col2, t);
}
float softshadow41(vec3 pt, vec3 rd, float mint, float maxt, float k)
{
   float res = 1.0;
   float t = mint;
   for(int i=0;i<256;i++)
   {
      float h = color_mix40(pt + rd*t,0.6);
      if (h<0.001) return 0.0;
      res = min(res, k*h/t);
      t += h;
      if (t>maxt) break;
    }
    return res;
}
float softshadow_obj41(vec3 pt, vec3 rd, float mint, float maxt, float k, float strong) {
   return color_mix40(pt,0.6);
}
vec3 softshadow_color41(vec3 pt, vec3 rd, float mint, float maxt, float k, float strong) {
   vec3 color = color_mix_color40(pt,0.6);
   float shadow = softshadow41(pt,rd,mint,maxt,k);
   return (shadow/strong+(1.0-1.0/strong))*color;
}
float ao42(vec3 pt, vec3 n, float d, float i)
{
    float o;
    for(float i=1.;i>0.;i--) {
      o-=(i*d-abs(softshadow_obj41(pt+n*i*d,vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0)))/pow(2.,i);
    }
    return o;
}
vec3 normal42(vec3 pt, float time)
{
  float fx = softshadow_obj41(pt+vec3(1.0,0.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0) - softshadow_obj41(pt-vec3(1.0,0.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
  float fy = softshadow_obj41(pt+vec3(0.0,1.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0) - softshadow_obj41(pt-vec3(0.0,1.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
  float fz = softshadow_obj41(pt+vec3(0.0,0.0,1.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0) - softshadow_obj41(pt-vec3(0.0,0.0,1.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
  return normalize(vec3(-fx,-fy,-fz))/2.0+vec3(0.5,0.5,0.5);
}
float ao_obj42(vec3 pt, float d, float i)
{
   return softshadow_obj41(pt,vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
}
vec3 ao_color42(vec3 pt, float d, float i)
{
   vec3 n = normal42(pt,time);
   float ao = ao42(pt,n,d,i);
   ao = clamp(ao,0.0,1.0);
   vec3 c = softshadow_color41(pt,vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
   vec3 c2 = mix(c,vec3(1.0,1.0,1.0),ao);
   return c2;
}
vec3 ray(vec3 p1, vec3 p2, float t)
{
   return p1 + t*(p2-p1);
}
float solve(vec3 p1, vec3 p2, float t_0, float t_1, float time)
{
    float t = t_0;
    for(int i=0;i<600;i++)
    {
       vec3 pt = ray(p1,p2,t);
       float Ht = ao_obj42(pt,6.2,50.0);
       if (abs(Ht)<0.5) return t;
       if (t>t_1) return 0.0;
       t+= Ht / 5.0;
    }
    return 0.0;
}
vec3 render(vec3 p0, vec3 p1)
{
   float t = solve(p0,p1,0.0, 1600.0, time);
   vec3 pt = ray(p0,p1, t);
   vec3 rgb = ao_color42(pt,6.2,50.0);
   return rgb;
}
void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.yy );
	pos = vec2(pos.x,1.0-pos.y);
        vec3 p0 = vec3(pos-vec2(0.5),-400.0);
	vec3 p1 = vec3(pos*2.0-vec2(1.0),-399.0);
vec3 rgb = render(p0,p1);
	gl_FragColor = vec4( rgb, 1.0 );

}