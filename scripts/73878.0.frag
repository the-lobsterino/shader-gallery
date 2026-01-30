shader noise_colors(
 point Po = point(u,v,0),
 float Time = 1.0,
 output vector Out = 0,
)
{
float Pi = 10.;
int   complexity      = 30;    // More points of color.
float fluid_speed     = 600.0;  // Drives speed, higher number will make it slower.
float color_intensity = 0.5;
point p = Po;
p *= 2;
for(int i=1;i<complexity;i++)
  {
    point newp=p + Time*0.001;
    newp[0]+=0.6/float(i)*sin(float(i)*p[1]+Time/fluid_speed+20.3*float(i)) + 0.5; // + mouse.y/mouse_factor+mouse_offset;
    newp[1]+=0.6/float(i)*sin(float(i)*p[0]+Time/fluid_speed+0.3*float(i+10)) - 0.5; // - mouse.x/mouse_factor+mouse_offset;
    p=newp;
}
vector col=color(color_intensity*sin(5.0*p[0])+color_intensity,color_intensity*sin(3.0*p[1])+color_intensity,color_intensity*sin(p[0]+p[1])+color_intensity);
Out =col;
}

