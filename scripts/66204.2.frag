#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D backbuffer; 

// Queen Elizabeth I 
//
// Xavierseb 2019

//#define QUEEN

// Elizabeth R I
#define E01_x vec4(-5.8,-6.3,-6.6,-7.05)
#define E02_x vec4(-8.2,-7.78,-6.24,-4.8)
#define E03_x vec4(-6.36,-5.95,-5.8,-5.67)
#define E04_x vec4(-5.47,-5.63,-5.67,-5.8)
#define E05_x vec4(-13.9,-13.05,-7.8,-3.52)
#define E06_x vec4(-3.76,-.85,-.77,-6.6)
#define E07_x vec4(-6.6,-10.3,-11.83,-11.5)
#define E08_x vec4(-11.5,-11.1,-9.97,-10.9)
#define E09_x vec4(-10.85,-14.8,-13.2,-13.24)
#define E10_x vec4(-13.24,-14.33,-16.7,-12.88)
#define E11_x vec4(-3.24,-3.9,-5.02,-5.7)
#define E12_x vec4(-6.,-5.95,-5.43,-5.46)
#define E13_x vec4(-4.74,-4.53,-4.45,-4.66)
#define E14_x vec4(-4.82,-4.75,-4.5,-4.51)
#define E15_x vec4(-3.67,-3.7,-3.6,-3.35)
#define E16_x vec4(-2.22,-3.7,-5.1,-1.1)
#define E17_x vec4(-1.1,-2.1,-3.44,-4.13)
#define E18_x vec4(-4.13,-.8,3.9,3.2)
#define E19_x vec4(3.2,3.17,-6.08,-6.1)
#define E20_x vec4(-6.1,-5.06,3.7,3.77)
#define E21_x vec4(3.77,4.,-4.3,-4.5)
#define E22_x vec4(-.04,-.85,-.9,-1.05)
#define E23_x vec4(-1.05,-.8,-.4,-.04)
#define E24_x vec4(.4,.05,-.4,.45)
#define E25_x vec4(-2.1,-4.17,-1.5,1.42) 
#define E26_x vec4(1.42,6.33,5.9,2.15)
#define E27_x vec4(2.15,-5.14,-.2,2.)
#define E28_x vec4(2.,3.77,7.,2.4)
#define E29_x vec4(2.4,-2.5,-3.76,1.46)
#define E30_x vec4(1.46,3.6,3.7,2.7)
#define E31_x vec4(2.7,2.07,1.26,1.2)
#define E32_x vec4(.73,1.54,2.44,2.4)
#define E33_x vec4(2.4,2.96,1.75,1.4)
#define E34_x vec4(4.1,4.5,4.26,4.1)
#define E35_x vec4(4.1,3.54,2.3,4.03)
#define E36_x vec4(5.4,4.23,4.96,5.4)
#define E37_x vec4(5.1,5.36,5.6,5.85)
#define E38_x vec4(9.26,7.03,6.54,6.)
#define E39_x vec4(6.3,7.8,8.12,7.7)

#ifdef QUEEN
#define E40_x vec4(7.7,7.6,4.4,10.55)
#define E41_x vec4(10.43,10.4,9.9,9.94)
#define E42_x vec4(9.3,9.86,10.43,10.75)
#define E43_x vec4(8.85,10.55,12.13,10.9)
#define E44_x vec4(10.9,10.15,8.44,12.8)
#define E45_x vec4(12.8,17.08,16.3,12.4)
#define E46_x vec4(12.4,8.04,8.32,12.8)
#define E47_x vec4(12.8,18.05,17.08,13.55)
#define E48_x vec4(13.55,12.94,9.9,11.32)
#else
#define E40_x vec4(7.7,7.6,4.4,10.55)
#define E41_x vec4(10.35,23.2,13.15,12.1)
#define E42_x vec4(12.1,11.73,7.9,12.54)
#define E43_x vec4(12.54,15.9,12.25,13.)
#define E44_x vec4(13.,13.8,15.9,12.4)
#define E45_x vec4(12.4,8.2,12.6,11.5)
#define E46_x vec4(11.5,8.9,5.97,8.65)
#endif

#define E01_y vec4(6.3,4.25,1.2,-4.34)
#define E02_y vec4(4.9,6.6,6.24,6.36)
#define E03_y vec4(1.9,2.15,2.2,2.1)
#define E04_y vec4(2.6,2.23,2.,1.46)
#define E05_y vec4(-4.14,-2.9,-3.9,-5.64)
#define E06_y vec4(-5.55,-6.7,-2.9,-5.35)
#define E07_y vec4(-5.35,-6.5,-5.96,-4.74)
#define E08_y vec4(-4.74,-3.5,-5.2,-4.7)
#define E09_y vec4(-5.84,-5.1,-7.55,-6.33)
#define E10_y vec4(-6.33,-4.9,-8.84,-7.26)
#define E11_y vec4(7.,7.54,2.67,-2.03)
#define E12_y vec4(-2.,-2.1,-2.07,-2.03)
#define E13_y vec4(-1.1,-.53,-1.4,-2.03)
#define E14_y vec4(-2.,-2.07,-2.07,-2.03)
#define E15_y vec4(1.53,1.33,1.17,1.3)
#define E16_y vec4(.08,.7,-2.07,-1.1)
#define E17_y vec4(-1.1,-1.38,-2.55,-2.1)
#define E18_y vec4(-2.1,-2.88,-6.04,-3.77)
#define E19_y vec4(-3.77,-2.15,-5.84,-3.85)
#define E20_y vec4(-3.85,-1.46,-7.9,-5.9)
#define E21_y vec4(-5.9,-3.37,-8.27,-5.55)
#define E22_y vec4(-1.06,-.77,-1.74,-2.84)
#define E23_y vec4(-2.84,-2.47,-1.95,-1.8)
#define E24_y vec4(-1.,-1.7,-3.97,-1.83)
#define E25_y vec4(5.67,2.9,2.96,5.5)
#define E26_y vec4(5.5,8.47,5.8,5.2)
#define E27_y vec4(5.2,4.58,-.4,4.46)
#define E28_y vec4(4.46,7.9,5.07,4.25)
#define E29_y vec4(4.25,3.32,-.12,1.3)
#define E30_y vec4(1.3,1.86,3.6,2.55)
#define E31_y vec4(2.55,2.,-1.34,-3.)
#define E32_y vec4(-3.04,-2.88,-3.65,-2.03)
#define E33_y vec4(-2.03,-1.18,-.65,-1.62)
#define E34_y vec4(-.78,-1.02,-1.26,-1.46)
#define E35_y vec4(-1.46,-1.02,-4.02,-2.56)
#define E36_y vec4(-.37,-2.84,-3.7,-2.6)
#define E37_y vec4(-1.43,-1.4,-1.43,-1.3)
#define E38_y vec4(2.1,2.14,-1.22,-2.97)
#define E39_y vec4(-1.8,-.7,-1.67,-2.6)

#ifdef QUEEN
#define E40_y vec4(-2.6,-3.9,-1.67,-1.75)
#define E41_y vec4(-.25,-1.4,-2.44,-3.)
#define E42_y vec4(-3.13,-3.05,-3.13,-3.4)
#define E43_y vec4(-.9,.6,-.7,-1.6)
#define E44_y vec4(-1.6,-2.76,.48,-3.25)
#define E45_y vec4(-3.25,-6.2,-1.22,-4.1)
#define E46_y vec4(-4.1,-7.67,-2.24,-5.07)
#define E47_y vec4(-5.07,-7.4,-3.13,-5.93)
#define E48_y vec4(-5.93,-6.78,-6.3,-5.24)
#define fW 48.
#else
#define E40_y vec4(-2.6,-3.9,-1.67,-2.03)
#define E41_y vec4(-2.03,-3.13,5.6,-2.16)
#define E42_y vec4(-2.16,-6.65,-2.52,-2.72)
#define E43_y vec4(-2.72,-2.56,-6.57,-2.3)
#define E44_y vec4(-2.3,1.9,-1.5,-1.63)
#define E45_y vec4(-1.63,-1.7,.92,-2.8)
#define E46_y vec4(-2.8,-9.25,-3.53,-5.07)
#define fW 46.
#endif

#define color vec3(.3,.84,.5)   
// thickness 0.0 - 1.0
#define thickness .9
#define ch(m,n) else if(t0<++h+1.) for(float ut=-0.05; ut<.1; ut+=.005) spot+=1.-smoothstep(length(getPos(t0-h+ut,m,n*aspect)-v)*thickness,0.00,.012); 

vec2 getPos(float t, vec4 x, vec4 y)
{
    float t1 = 1.-t; 
    vec4 n = vec4(t1*t1*t1, 3.*t1*t1*t, 3.*t1*t*t, t*t*t);    
    return vec2(dot(x,n), dot(y,n));
}
	
void main( void ){
    vec2 position = gl_FragCoord.xy/resolution.xy, v = (position-.5)*fW;    
    float spot=0., h=0.,t0=mod(time*1.,3.),aspect=resolution.x/resolution.y;
	
     if(t0<h+1.);
     ch(E01_x,E01_y) 
	     
	     
	    /*ch(E02_x,E02_y) ch(E03_x,E03_y) ch(E04_x,E04_y) ch(E05_x,E05_y)  
     ch(E06_x,E06_y) ch(E07_x,E07_y) ch(E08_x,E08_y)
     ch(E09_x,E09_y)  ch(E10_x,E10_y) ch(E11_x,E11_y) ch(E12_x,E12_y)
     ch(E13_x,E13_y)  ch(E14_x,E14_y) ch(E15_x,E15_y) ch(E16_x,E16_y)
     ch(E17_x,E17_y)  ch(E18_x,E18_y) ch(E19_x,E19_y) ch(E20_x,E20_y)    
     ch(E21_x,E21_y)  ch(E22_x,E22_y) ch(E23_x,E23_y) ch(E24_x,E24_y)
     ch(E25_x,E25_y)  ch(E26_x,E26_y) ch(E27_x,E27_y) ch(E28_x,E28_y)
     ch(E29_x,E29_y)  ch(E30_x,E30_y) ch(E31_x,E31_y) ch(E32_x,E32_y)
     ch(E33_x,E33_y)  ch(E34_x,E34_y) ch(E35_x,E35_y) ch(E36_x,E36_y)
     ch(E37_x,E37_y)  ch(E38_x,E38_y) ch(E39_x,E39_y) ch(E40_x,E40_y)    
     ch(E41_x,E41_y)  ch(E42_x,E42_y) ch(E43_x,E43_y) ch(E44_x,E44_y)
     ch(E45_x,E45_y)  ch(E46_x,E46_y)    
#ifdef QUEEN
     ch(E47_x,E47_y)     ch(E48_x,E48_y)
#endif
    	*/
    if(t0>.51) 
	    gl_FragColor = vec4(-spot*color,1.) + texture2D(backbuffer,position);
    else 
	    gl_FragColor = vec4(0.)+ texture2D(backbuffer,position);
}