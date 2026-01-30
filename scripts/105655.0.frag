#define ICE 0

// Modified so it doesn't really move. Very childish and easy fix.
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution, mouse;
uniform float time;
uniform float u_value;
uniform sampler2D u_img_tex; // Use this for Image texture
uniform sampler2D u_lay_tex; // A layer texture
uniform sampler2D texture;
vec3 firePalette(float i) {
  float T = 1400. + 1300. * i; // Temperature range (in Kelvin).
  vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
  L = pow(L, vec3(5.0)) * (exp(1.43876719683e5 / (T * L)) - 1.0);
  return 1.0 - exp(-5e8 / L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}

const float Pi = 3.14
	;
const int   complexity      = 500;    // More points of color.
const float fluid_speed     = 1.0;  // Drives speed, higher number will make it slower.
const float color_intensity = 0.5;
void main()
{
    vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x, resolution.y);
    p /= 4.*dot( p, p );
    for (int i=1;i<complexity;i++)
    {
        vec2 newp=p + time*0.001+.08;
        newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+20.3*float(i)) + 0.5;// + mouse.y/mouse_factor+mouse_offset;
        newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5;// - mouse.x/mouse_factor+mouse_offset;
        p=newp;
    }
    vec3 col=vec3(color_intensity*sin(5.0*p.x)+color_intensity, color_intensity*sin(3.0*p.y)+color_intensity, color_intensity*sin(p.x+p.y)+color_intensity);
    col = 4.*firePalette( col.x*col.y+.2*col.z );
	#if ( ICE == 1 )
	col = 1. - col;
	#endif
	col = 1. - exp( -col );
	gl_FragColor=vec4(col, 1);
}//ändrom3da4twist