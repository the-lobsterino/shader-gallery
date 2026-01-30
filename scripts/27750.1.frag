#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float plane17(vec3 pt, vec3 center, vec3 u_x, vec3 u_y, float sx, float sy)
{
   pt-=center;
   vec3 normal = normalize(cross(u_x, u_y));
   float val = dot(pt, normal);
   return val;
}
vec3 plane_color17(vec3 pt, vec3 center, vec3 u_x, vec3 u_y, float sx, float sy)
{
   float v_x = dot(pt-center, u_x)/length(u_x)/length(u_x);
   float v_y = dot(pt-center, u_y)/length(u_y)/length(u_y);
   v_x/=sx;
   v_y/=sy;
   v_x = abs(fract(v_x));
   v_y = abs(fract(v_y));
   return vec3(v_x,v_y,1.0);
}
float grayscale18(vec3 pt, float time)
{
   return plane17(pt,vec3(0.0, 100.0, 0.0),vec3(4.0, 0.0, 0.0),vec3(0.0, 0.0, 4.0),100.0,100.0);
}
vec3 grayscale_color18(vec3 pt, float time)
{
  vec3 col = plane_color17(pt,vec3(0.0, 100.0, 0.0),vec3(4.0, 0.0, 0.0),vec3(0.0, 0.0, 4.0),100.0,100.0);
  float c = (col.x+col.y+col.z+1.0)/4.0;
  return vec3(c,c,c);
}
float rbox11(vec3 pt, vec3 tl, vec3 br, float r)
{
   pt-=tl;
   vec3 s = br-tl;
   return length(max(abs(pt)-s+vec3(r),0.0))-r;
}
vec3 rbox_color11(vec3 pt, vec3 tl, vec3 br, float r)
{
   return vec3(1.0,1.0,1.0);
}
float color_choose12(vec3 pt, vec3 color) {
   return rbox11(pt,vec3(0.0, 0.0, 0.0),vec3(100.0, 100.0, 100.0),20.0);
}
vec3 color_choose_color12(vec3 pt, vec3 color) {
   return color;
}
float sphere5(vec3 center, float radius, vec3 pt)
{
   pt-=center;
   return length(pt)-radius;
}
vec3 sphere_color5(vec3 center, float radius, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float and_not13(vec3 pt)
{
   float v1 = color_choose12(pt,vec3(1.0, 0.0, 0.0));
   float v2 = sphere5(vec3(0.0, 0.0, 0.0),130.0,pt);
   float res = max(v1,-v2);
   return res;
}
vec3 and_not_color13(vec3 pt)
{
   float v = color_choose12(pt,vec3(1.0, 0.0, 0.0));
   if (v>-0.8 && v<0.8) return color_choose_color12(pt,vec3(1.0, 0.0, 0.0));
   return sphere_color5(vec3(0.0, 0.0, 0.0),130.0,pt);
}
float sphere6(vec3 center, float radius, vec3 pt)
{
   pt-=center;
   return length(pt)-radius;
}
vec3 sphere_color6(vec3 center, float radius, vec3 pt)
{
   return vec3(1.0,1.0,1.0);
}
float color_choose7(vec3 pt, vec3 color) {
   return sphere6(vec3(0.0+100.0*sin(time*12.0/5.0),0.0,0.0),90.0,pt);
}
vec3 color_choose_color7(vec3 pt, vec3 color) {
   return color;
}
float or_elem14(vec3 pt)
{
   float v1 = and_not13(pt);
   float v2 = color_choose7(pt,vec3(1.0, 0.1, 0.6));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color14(vec3 pt)
{
   float val = and_not13(pt);
   if (val>-0.8 && val<0.8) return and_not_color13(pt);
   return color_choose_color7(pt,vec3(1.0, 0.1, 0.6));
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
float color_choose9(vec3 pt, vec3 color) {
   return sphere8(vec3(0.0,0.0,0.0+100.0*sin(time)),90.0,pt);
}
vec3 color_choose_color9(vec3 pt, vec3 color) {
   return color;
}
float or_elem15(vec3 pt)
{
   float v1 = or_elem14(pt);
   float v2 = color_choose9(pt,vec3(0.0, 1.0, 0.0));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color15(vec3 pt)
{
   float val = or_elem14(pt);
   if (val>-0.8 && val<0.8) return or_elem_color14(pt);
   return color_choose_color9(pt,vec3(0.0, 1.0, 0.0));
}
float line10(vec3 pt, vec3 tl, vec3 br, float line_width1, float line_width2)
{
   vec3 pa = pt-tl, ba = br-tl;
   float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
   return length( pa - ba*h ) - ((1.0-h)*line_width1+h*line_width2);
}
vec3 line_color10(vec3 pt, vec3 tl, vec3 br, float line_width1, float line_width2)
{
   return vec3(1.0,1.0,1.0);
}
float or_elem16(vec3 pt)
{
   float v1 = or_elem15(pt);
   float v2 = line10(pt,vec3(-300.0, 0.0, 0.0),vec3(-300.0, 100.0, 0.0),20.0,10.0);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color16(vec3 pt)
{
   float val = or_elem15(pt);
   if (val>-0.8 && val<0.8) return or_elem_color15(pt);
   return line_color10(pt,vec3(-300.0, 0.0, 0.0),vec3(-300.0, 100.0, 0.0),20.0,10.0);
}
float or_elem19(vec3 pt)
{
   float v1 = grayscale18(pt,time);
   float v2 = or_elem16(pt);
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color19(vec3 pt)
{
   float val = grayscale18(pt,time);
   if (val>-0.8 && val<0.8) return grayscale_color18(pt,time);
   return or_elem_color16(pt);
}
float torus20(vec3 pt, float radius_1, float radius_2)
{
   return length(vec2(length(pt.xz)-radius_1, pt.y)) - radius_2;
}
vec3 torus_color20(vec3 pt, float radius_1, float radius_2)
{
   return vec3(1.0,1.0,1.0);
}
float trans21(vec3 pt, vec3 delta)
{
   pt-=delta;
   return torus20(pt,100.0,30.0);
}
vec3 trans_color21(vec3 pt, vec3 delta)
{
    pt-=delta;
    return torus_color20(pt,100.0,30.0);
}
float or_elem22(vec3 pt)
{
   float v1 = or_elem19(pt);
   float v2 = trans21(pt,vec3(300.0, 60.0, 0.0));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color22(vec3 pt)
{
   float val = or_elem19(pt);
   if (val>-0.8 && val<0.8) return or_elem_color19(pt);
   return trans_color21(pt,vec3(300.0, 60.0, 0.0));
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
float or_elem23(vec3 pt)
{
   float v1 = or_elem22(pt);
   float v2 = color_choose4(pt,vec3(0.7, 0.8, 1.0));
   float res = min(v1,v2);
   return res;
}
vec3 or_elem_color23(vec3 pt)
{
   float val = or_elem22(pt);
   if (val>-0.8 && val<0.8) return or_elem_color22(pt);
   return color_choose_color4(pt,vec3(0.7, 0.8, 1.0));
}
float roty24(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(vec3(cos(angle),0.0,sin(angle)),
          vec3(0.0, 1.0, 0.0),
          vec3(-sin(angle),0.0,cos(angle)));
   float v1 = or_elem23(m*pt);
   return v1;
}
vec3 roty_color24(vec3 pt, vec3 center, float angle)
{
  mat3 m = mat3(vec3(cos(angle),0.0,sin(angle)),
          vec3(0.0, 1.0, 0.0),
          vec3(-sin(angle),0.0,cos(angle)));
   vec3 v1 = or_elem_color23(m*pt);
   return v1;
}
float from_obj_color25(vec3 pt, float time) {
    return roty24(pt,vec3(0.0,0.0,0.0),time/1.25);
}
vec3 from_obj_color_color25(vec3 pt, float time) {
   return roty_color24(pt,vec3(0.0,0.0,0.0),time/1.25);
}
vec3 normal26(vec3 pt, float time)
{
  float fx = from_obj_color25(pt+vec3(1.0,0.0,0.0),time) - from_obj_color25(pt-vec3(1.0,0.0,0.0),time);
  float fy = from_obj_color25(pt+vec3(0.0,1.0,0.0),time) - from_obj_color25(pt-vec3(0.0,1.0,0.0),time);
  float fz = from_obj_color25(pt+vec3(0.0,0.0,1.0),time) - from_obj_color25(pt-vec3(0.0,0.0,1.0),time);
  return normalize(vec3(-fx,-fy,-fz))/2.0+vec3(0.5,0.5,0.5);
}
float obj26(vec3 pt, float time)
{
   return from_obj_color25(pt,time);
}
vec3 obj_color26(vec3 pt, float time)
{
   return normal26(pt,time);
}
float color_mix27(vec3 pt, float t) {
   return roty24(pt,vec3(0.0,0.0,0.0),time/1.25);
}
vec3 color_mix_color27(vec3 pt, float t) {
   vec3 col1 = roty_color24(pt,vec3(0.0,0.0,0.0),time/1.25);
   vec3 col2 = obj_color26(pt,time);
   return mix(col1, col2, t);
}
float softshadow28(vec3 pt, vec3 rd, float mint, float maxt, float k)
{
   float res = 1.0;
	 float h=0.0;
   float t=mint;
   for(int i=0;i<256;i++)
   {
      h = color_mix27(pt + rd*t,0.6);
      if (h<0.001) return 0.0;
      res = min(res, k*h/t);
      t+=h;
      if (t>maxt) break;
   }
    return res;
}
float softshadow_obj28(vec3 pt, vec3 rd, float mint, float maxt, float k, float strong) {
   return color_mix27(pt,0.6);
}
vec3 softshadow_color28(vec3 pt, vec3 rd, float mint, float maxt, float k, float strong) {
   vec3 color = color_mix_color27(pt,0.6);
   float shadow = softshadow28(pt,rd,mint,maxt,k);
   return (shadow/strong+(1.0-1.0/strong))*color;
}
float ao29(vec3 pt, vec3 n, float d, float i)
{
    float o;
    for(float i=1.0;i>0.0;i--) {
      o-=(i*d-abs(softshadow_obj28(pt+n*i*d,vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0)))/pow(2.,i);
    }
    return o;
}
vec3 normal29(vec3 pt, float time)
{
  float fx = softshadow_obj28(pt+vec3(1.0,0.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0) - softshadow_obj28(pt-vec3(1.0,0.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
  float fy = softshadow_obj28(pt+vec3(0.0,1.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0) - softshadow_obj28(pt-vec3(0.0,1.0,0.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
  float fz = softshadow_obj28(pt+vec3(0.0,0.0,1.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0) - softshadow_obj28(pt-vec3(0.0,0.0,1.0),vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
  return normalize(vec3(-fx,-fy,-fz))/2.0+vec3(0.5,0.5,0.5);
}
float ao_obj29(vec3 pt, float d, float i)
{
   return softshadow_obj28(pt,vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
}
vec3 ao_color29(vec3 pt, float d, float i)
{
   vec3 n = normal29(pt,time);
   float ao = ao29(pt,n,d,i);
   vec3 c = softshadow_color28(pt,vec3(-20.0, -40.0, -20.0),0.0,1.0,2.0,8.0);
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
       float Ht = ao_obj29(pt,6.2,50.0);
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
   vec3 rgb = ao_color29(pt,6.2,50.0);
   return rgb;
}
void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.yy );
	pos = vec2(pos.x, 1.0-pos.y);
       vec3 p0 = vec3(pos-vec2(0.5),-400.0);
       vec3 p1 = vec3(pos*2.0-vec2(1.0),-399.0);
      vec3 rgb = render(p0,p1);

	gl_FragColor = vec4( rgb, 1.0 );

}