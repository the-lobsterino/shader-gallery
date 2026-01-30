#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform float u_time;
vec3 rgb = vec3(0., 1.0, 0.95); //these values would be changes by a pak object sending to the rgb parameter

float PI = 3.141592654;
float TwoPI = PI*2.;
float fourth = (PI*4.)/3.;
float third = TwoPI/3.;

void main(){
	
    vec2 st = gl_FragCoord.xy/resolution.xy;//made sure to use texdim0 in Max
    float red = 0.0;
    float blue = 0.0;
    float green = 0.0;
    float val = 25.0;
    float x = 0.5;
    float y = 0.5;
    float r = (-1. * rgb.r)+1.;
    float g = (-1. * rgb.g)+1.;
    float b = (-1. * rgb.b)+1.;

    red = pow(distance(st,vec2((sin(time)/(r*val))+x,(cos(time)/(r*val))+y)),distance(st,vec2((sin(time)/(b+g))+x,cos(time)/(b+g))+y));
    
    
    blue = pow(distance(st,vec2((sin(time-third)/(b*val))+x,(cos(time-third)/(b*val))+y)), distance(st,vec2((sin(time-third)/(r+g))+x,(cos(time-third)/(r+g))+y)));
    
    
    green = pow(distance(st,vec2((sin(time-fourth)/(g*val))+x,(cos(time-fourth)/(g*val))+y)), distance(st,vec2((sin(time-fourth)/(r+b))+x, (cos(time-fourth)/(r+b))+y)));
    

    vec3 color = vec3(red,green,blue);

    gl_FragColor = vec4(color, 1.0 );
	
}