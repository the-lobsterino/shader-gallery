#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float sphere(vec3 center, float radius, float time, vec3 pt)
{
  pt-=center;
  return length(pt)-radius; //+5*sin(time+pt.x*3/10.0+pt.y*5/25.0);
}
float box(vec3 pt, vec3 center, float size)
{
   pt-=center;
   return length(max(abs(pt)-size,0.0))-10.0;
}

vec3 roty(vec3 pt, float time)
{
  mat3 m = mat3(vec3(cos(time),0.0,sin(time)),
                vec3(0.0, 1.0, 0.0),
                vec3(-sin(time),0.0,cos(time)));
  return pt*m;   
}
float sphere_box(vec3 pt, vec3 center, float radius, float size, float time)
{
   float f = sphere(center, radius, time, pt);
   float f2 = box(pt, center, size);
   return max(-f,f2);
}
float sphere_box_rep(vec3 pt, vec3 center, float radius, float size, float time)
{
   pt-=center;
   vec3 c = vec3(300.0,400.0,400.0);
   vec3 q = mod(pt,c)-0.5*c;
   q+=center;
   float f = sphere_box(q, center, radius, size, time);
   return f;
}
float sphere_box_rep_scale(vec3 pt, vec3 center, float radius, float size, float time)
{  pt.y+=time*1580.0;
   return sphere_box_rep(pt*2.0-50.0, center, radius,size,time);
}
float obj(vec3 pt, float time)
{
   vec3 pt1 = pt-vec3(0.0,0.0,150.0);
   vec3 pt2 = roty(pt1, time);
   vec3 pt3 = pt2+vec3(0.0,0.0,150.0);
   return sphere_box_rep_scale(pt3, vec3(0.0,0.0,150.0), 50.0, 30.0, time);
}
vec3 normal(vec3 pt, float time)
{
   float x = obj(pt, time);
   float y = obj(pt+vec3(0.0,0.0,1.0), time);
   float z = obj(pt+vec3(0.0,1.0,0.0), time);
   return vec3(x,y,z);
}
vec3 obj_color(vec3 pt, float time)
{
   return normal(pt,time);
}
vec3 ray(vec3 p1, vec3 p2, float t)
{
   return p1 + t*(p2-p1);
}
float solve(vec3 p1, vec3 p2, float t_0, float time)
{
    float t = t_0;
    for(int i=0;i<250;i++)
    {
       float Ht = obj(ray(p1,p2,t),time);
       if (abs(Ht)<0.1) return t;
       t+= Ht / 10.0;
    }
    return 0.0;
}
void main( void ) {

	vec2 pos = ( gl_FragCoord.xy /resolution );
	pos.x*=1.8;
        vec3 p0 = vec3(pos-vec2(0.5),0.0);
	vec3 p1 = vec3(pos*2.0-vec2(1.0),1.0);

	float t = solve(p0,p1, 0.0, time/10.0);
	vec3 pos2 = ray(p0,p1,t);
	vec3 col = obj_color(pos2, time/10.0);
	gl_FragColor = vec4( col, 1.0 );

}